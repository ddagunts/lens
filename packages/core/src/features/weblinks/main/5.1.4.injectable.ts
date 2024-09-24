/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { weblinkStoreMigrationInjectionToken } from "../common/migration-token";
import type { WeblinkData } from "../common/storage.injectable";

const v514WeblinkStoreMigrationInjectable = getInjectable({
  id: "v5.1.4-weblink-store-migration",
  instantiate: () => ({
    version: "5.1.4",
    run(store) {
      const weblinksRaw = store.get("weblinks");
      const weblinks = (Array.isArray(weblinksRaw) ? weblinksRaw : []) as WeblinkData[];

      store.set("weblinks", weblinks);
    },
  }),
  injectionToken: weblinkStoreMigrationInjectionToken,
});

export default v514WeblinkStoreMigrationInjectable;

