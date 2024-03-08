/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Cluster } from "../../../common/cluster/cluster";
import { loggerInjectionToken } from "@openlens/logger";
import kubeconfigManagerInjectable from "../../kubeconfig-manager/kubeconfig-manager.injectable";
import listHelmReleasesInjectable from "../list-helm-releases.injectable";
import type { AsyncResult } from "@openlens/utilities";
import type { ListedHelmRelease } from "../../../features/helm-releases/common/channels";

export type ListClusterHelmReleases = (cluster: Cluster, namespace?: string) => AsyncResult<ListedHelmRelease[], string>;

const listClusterHelmReleasesInjectable = getInjectable({
  id: "list-cluster-helm-releases",

  instantiate: (di): ListClusterHelmReleases => {
    const logger = di.inject(loggerInjectionToken);
    const listHelmReleases = di.inject(listHelmReleasesInjectable);

    return async (cluster, namespace) => {
      const proxyKubeconfigManager = di.inject(kubeconfigManagerInjectable, cluster);
      const proxyKubeconfigPath = await proxyKubeconfigManager.ensurePath();

      logger.debug(`[CLUSTER]: listing helm releases for clusterId=${cluster.id}`, { namespace });

      return listHelmReleases(proxyKubeconfigPath, namespace);
    };
  },
});

export default listClusterHelmReleasesInjectable;
