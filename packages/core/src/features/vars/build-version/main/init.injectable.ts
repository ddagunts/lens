/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { beforeApplicationIsLoadingInjectionToken } from "@openlens/application";
import { getInjectablesForInitializable } from "../../../../common/initializable-state/create";
import getBuildVersionInjectable from "../../../../main/electron-app/features/get-build-version.injectable";
import { buildVersionInitializable } from "../common/token";

export const {
  stateInjectable: buildVersionStateInjectable,
  initializationInjectable: buildVersionInitializationInjectable,
} = getInjectablesForInitializable({
  token: buildVersionInitializable,
  phase: beforeApplicationIsLoadingInjectionToken,
  init: (di) => {
    const getBuildVersion = di.inject(getBuildVersionInjectable);

    return getBuildVersion();
  },
});
