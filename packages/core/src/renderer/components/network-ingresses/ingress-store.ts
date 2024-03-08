/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Ingress } from "@openlens/kube-object";
import type { IngressApi } from "../../../common/k8s-api/endpoints";
import { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";

export class IngressStore extends KubeObjectStore<Ingress, IngressApi> {
}
