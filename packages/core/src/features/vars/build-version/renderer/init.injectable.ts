/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { requestFromChannelInjectionToken } from "@openlens/messaging";
import { getInjectablesForInitializable } from "../../../../common/initializable-state/create";
import { beforeFrameStartsSecondInjectionToken } from "../../../../renderer/before-frame-starts/tokens";
import { buildVersionChannel, buildVersionInitializable } from "../common/token";

export const {
  stateInjectable: buildVersionStateInjectable,
  initializationInjectable: buildVersionInitializationInjectable,
} = getInjectablesForInitializable({
  token: buildVersionInitializable,
  phase: beforeFrameStartsSecondInjectionToken,
  init: async (di) => {
    const requestFromChannel = di.inject(requestFromChannelInjectionToken);

    return requestFromChannel(buildVersionChannel);
  },
});
