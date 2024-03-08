/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LensExtensionId } from "@openlens/legacy-extensions";
import { getInjectable } from "@ogre-tools/injectable";
import { observable } from "mobx";

export interface LensExtensionState {
  enabled?: boolean;
  name: string;
}

const enabledExtensionsStateInjectable = getInjectable({
  id: "enabled-extensions-state",
  instantiate: () => observable.map<LensExtensionId, LensExtensionState>(),
});

export default enabledExtensionsStateInjectable;
