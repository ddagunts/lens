/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { hotbarStoreMigrationInjectionToken } from "../common/migrations-token";

const welcomePageMigration = getInjectable({
  id: "hotbar-store-welcome-page-migration",
  instantiate: (di) => ({
    version: "6.4.1",
    run: () => {
      return;
    },
  }),
  injectionToken: hotbarStoreMigrationInjectionToken,
});

export default welcomePageMigration;
