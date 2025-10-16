/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as debugHabitStrength from "../debugHabitStrength.js";
import type * as diagnose from "../diagnose.js";
import type * as habitStrength from "../habitStrength.js";
import type * as habits from "../habits.js";
import type * as http from "../http.js";
import type * as migration from "../migration.js";
import type * as notes from "../notes.js";
import type * as quickFix from "../quickFix.js";
import type * as router from "../router.js";
import type * as settings from "../settings.js";
import type * as testStrength from "../testStrength.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  articles: typeof articles;
  auth: typeof auth;
  debugHabitStrength: typeof debugHabitStrength;
  diagnose: typeof diagnose;
  habitStrength: typeof habitStrength;
  habits: typeof habits;
  http: typeof http;
  migration: typeof migration;
  notes: typeof notes;
  quickFix: typeof quickFix;
  router: typeof router;
  settings: typeof settings;
  testStrength: typeof testStrength;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
