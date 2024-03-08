/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { computed } from "mobx";
import { getGlobalOverride } from "@openlens/test-utils";
import forceUpdateModalRootFrameComponentInjectable from "./force-update-modal-root-frame-component.injectable";

export default getGlobalOverride(
  forceUpdateModalRootFrameComponentInjectable,

  () => ({
    id: "force-update-modal",
    Component: () => null,
    shouldRender: computed(() => false),
  }),
);
