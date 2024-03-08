/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { workloadInjectionToken } from "../workload-injection-token";
import { ResourceNames } from "../../../../utils/rbac";
import namespaceStoreInjectable from "../../../namespaces/store.injectable";
import jobStoreInjectable from "../../../workloads-jobs/store.injectable";
import navigateToJobsInjectable from "../../../../../common/front-end-routing/routes/cluster/workloads/jobs/navigate-to-jobs.injectable";
import { computed } from "mobx";

const jobsWorkloadInjectable = getInjectable({
  id: "jobs-workload",

  instantiate: (di) => {
    const navigate = di.inject(navigateToJobsInjectable);
    const namespaceStore = di.inject(namespaceStoreInjectable);
    const store = di.inject(jobStoreInjectable);

    return {
      resource: {
        apiName: "jobs",
        group: "batch",
      },
      open: navigate,

      amountOfItems: computed(
        () => store.getAllByNs(namespaceStore.contextNamespaces).length,
      ),

      status: computed(() =>
        store.getStatuses(store.getAllByNs(namespaceStore.contextNamespaces)),
      ),

      title: ResourceNames.jobs,
      orderNumber: 60,
    };
  },

  injectionToken: workloadInjectionToken,
});

export default jobsWorkloadInjectable;
