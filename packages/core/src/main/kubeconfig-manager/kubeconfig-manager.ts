/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { KubeConfig } from "@kubernetes/client-node";
import { dumpConfigYaml } from "../../common/kube-helpers";
import { isErrnoException } from "@openlens/utilities";
import { Md5 } from 'ts-md5';
import type { PartialDeep } from "type-fest";
import type { Logger } from "@openlens/logger";
import type { JoinPaths } from "../../common/path/join-paths.injectable";
import type { GetDirnameOfPath } from "../../common/path/get-dirname.injectable";
import type { PathExists } from "../../common/fs/path-exists.injectable";
import type { RemovePath } from "../../common/fs/remove.injectable";
import type { WriteFile } from "../../common/fs/write-file.injectable";
import type { SelfSignedCert } from "selfsigned";
import type { Cluster } from "../../common/cluster/cluster";
import type { LoadKubeconfig } from "../../common/cluster/load-kubeconfig.injectable";
import type { KubeAuthProxyServer } from "../cluster/kube-auth-proxy-server.injectable";

interface KubeconfigManagerDependencies {
  readonly directoryForTemp: string;
  readonly logger: Logger;
  readonly certificate: SelfSignedCert;
  readonly kubeAuthProxyServer: KubeAuthProxyServer;
  readonly kubeAuthProxyUrl: string;
  joinPaths: JoinPaths;
  getDirnameOfPath: GetDirnameOfPath;
  pathExists: PathExists;
  removePath: RemovePath;
  writeFile: WriteFile;
  loadKubeconfig: LoadKubeconfig;
}

export class KubeconfigManager {
  /**
   * The path to the temp config file
   *
   * - if `string` then path
   * - if `null` then not yet created or was cleared
   */
  protected tempFilePath: string | null = null;
  protected originalTempFilePath: string | null = null;

  constructor(
    private readonly dependencies: KubeconfigManagerDependencies,
    private readonly cluster: Cluster,
  ) {}

  /**
   *
   * @returns The path to the temporary kubeconfig
   */
  async ensurePath(): Promise<string> {
    if (this.tempFilePath === null || !(await this.dependencies.pathExists(this.tempFilePath))) {
      return await this.ensureFile();
    }

    return this.tempFilePath;
  }

  /**
   * Deletes the temporary kubeconfig files
   */
  async clear(): Promise<void> {
    if (!this.tempFilePath) {
      return;
    }

    if (!this.originalTempFilePath) {
      return;
    }

    this.dependencies.logger.info(`[KUBECONFIG-MANAGER]: Deleting temporary kubeconfig: ${this.tempFilePath}`);

    try {
      await this.dependencies.removePath(this.tempFilePath);
    } catch (error) {
      if (isErrnoException(error) && error.code !== "ENOENT") {
        throw error;
      }
    } finally {
      this.tempFilePath = null;
    }

    this.dependencies.logger.info(`[KUBECONFIG-MANAGER]: Deleting temporary original kubeconfig: ${this.originalTempFilePath}`);

    try {
      await this.dependencies.removePath(this.originalTempFilePath);
    } catch (error) {
      if (isErrnoException(error) && error.code !== "ENOENT") {
        throw error;
      }
    } finally {
      this.originalTempFilePath = null;
    }

  }

  protected async ensureFile() {
    try {
      await this.dependencies.kubeAuthProxyServer.ensureRunning();
      this.originalTempFilePath = await this.createOriginalKubeconfig();
      return this.tempFilePath = await this.createProxyKubeconfig();
    } catch (error) {
      throw new Error(`Failed to create temp config for auth-proxy: ${error}`);
    }
  }

  /**
   * Creates new "temporary" kubeconfig that point to the kubectl-proxy.
   * This way any user of the config does not need to know anything about the auth etc. details.
   */
  protected async createProxyKubeconfig(): Promise<string> {
    const { id, preferences: { defaultNamespace }} = this.cluster;
    const contextName = this.cluster.contextName.get();
    const tempFile = this.dependencies.joinPaths(
      this.dependencies.directoryForTemp,
      `kubeconfig-${id}`,
    );
    const kubeConfig = await this.dependencies.loadKubeconfig();
    const proxyConfig: PartialDeep<KubeConfig> = {
      currentContext: contextName,
      clusters: [
        {
          name: contextName,
          server: this.dependencies.kubeAuthProxyUrl,
          skipTLSVerify: false,
          caData: Buffer.from(this.dependencies.certificate.cert).toString("base64"),
        },
      ],
      users: [
        { name: "proxy", username: "lens", password: "fake" },
      ],
      contexts: [
        {
          user: "proxy",
          name: contextName,
          cluster: contextName,
          namespace: defaultNamespace || kubeConfig.getContextObject(contextName)?.namespace,
        },
      ],
    };
    // write
    const configYaml = dumpConfigYaml(proxyConfig);

    await this.dependencies.writeFile(tempFile, configYaml, { mode: 0o600 });
    this.dependencies.logger.debug(`[KUBECONFIG-MANAGER]: Created temp kubeconfig "${contextName}" at "${tempFile}": \n${configYaml}`);

    return tempFile;
  }

  /**
  * Creates a "temporary" original kubeconfig for the cluster.
  * This one is used to open Pod and Node shells in clusters behind proxies
  */
  protected async createOriginalKubeconfig(): Promise<string> {
    const { id } = this.cluster;
    const contextName = this.cluster.contextName.get();
    const contextNameHash = Md5.hashStr(contextName);
    const tempFile = this.dependencies.joinPaths(
      this.dependencies.directoryForTemp,
      `kubeconfig-${id}-${contextNameHash}`,
    );
    const kubeConfig = await this.dependencies.loadKubeconfig();

    const originalConfig: PartialDeep<KubeConfig> = {
      currentContext: this.cluster.contextName.get(),
      clusters: kubeConfig.getClusters(),
      users: kubeConfig.getUsers(),
      contexts: kubeConfig.getContexts(),
    };

    const configYaml = dumpConfigYaml(originalConfig);

    await this.dependencies.writeFile(tempFile, configYaml, { mode: 0o600 });
    this.dependencies.logger.debug(`[KUBECONFIG-MANAGER]: Created temp original kubeconfig "${contextName}" at "${tempFile}": \n${configYaml}`);

    return tempFile;
  }

}
