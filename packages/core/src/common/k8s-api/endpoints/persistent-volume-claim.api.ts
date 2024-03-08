/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { DerivedKubeApiOptions, KubeApiDependencies } from "../kube-api";
import { KubeApi } from "../kube-api";
import { PersistentVolumeClaim } from "@openlens/kube-object";

export class PersistentVolumeClaimApi extends KubeApi<PersistentVolumeClaim> {
  constructor(deps: KubeApiDependencies, opts?: DerivedKubeApiOptions) {
    super(deps, {
      ...opts ?? {},
      objectConstructor: PersistentVolumeClaim,
    });
  }
}

