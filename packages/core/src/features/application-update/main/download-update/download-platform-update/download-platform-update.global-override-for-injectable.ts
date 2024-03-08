/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getGlobalOverrideForFunction } from "@openlens/test-utils";
import downloadPlatformUpdateInjectable from "./download-platform-update.injectable";

export default getGlobalOverrideForFunction(downloadPlatformUpdateInjectable);
