/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getGlobalOverride } from "@openlens/test-utils";
import initializeSentryOnMainInjectable from "./initialize-on-main.injectable";

export default getGlobalOverride(initializeSentryOnMainInjectable, () => () => {});
