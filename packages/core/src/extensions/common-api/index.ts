/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { loggerInjectionToken } from "@openlens/logger";
import { asLegacyGlobalForExtensionApi } from "@openlens/legacy-global-di";

// APIs
export { App } from "./app";
export * as EventBus from "./event-bus";
export * as Store from "./stores";
export * as Util from "./utils";
export * as Catalog from "./catalog";
export * as Types from "./types";
export * as Proxy from "./proxy";

export type { Logger } from "@openlens/logger";
export type { LensExtension } from "../lens-extension";
export type { PackageJson } from "type-fest";
export type { LensExtensionManifest, InstalledExtension } from "@openlens/legacy-extensions";

export const logger = asLegacyGlobalForExtensionApi(loggerInjectionToken);
