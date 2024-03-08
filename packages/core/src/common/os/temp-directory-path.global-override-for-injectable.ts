/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getGlobalOverride } from "@openlens/test-utils";
import tempDirectoryPathInjectable from "./temp-directory-path.injectable";

export default getGlobalOverride(tempDirectoryPathInjectable, () => "/some-temp-directory");
