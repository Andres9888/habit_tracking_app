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
import type * as analytics from "../analytics.js";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as character from "../character.js";
import type * as debugHabitStrength from "../debugHabitStrength.js";
import type * as diagnose from "../diagnose.js";
import type * as habitStrength from "../habitStrength.js";
import type * as habits from "../habits.js";
import type * as http from "../http.js";
import type * as initializeAllHabitsStrength from "../initializeAllHabitsStrength.js";
import type * as migration from "../migration.js";
import type * as notes from "../notes.js";
import type * as predictions from "../predictions.js";
import type * as quickFix from "../quickFix.js";
import type * as recalculateAllHabitsStrength from "../recalculateAllHabitsStrength.js";
import type * as router from "../router.js";
import type * as settings from "../settings.js";
import type * as streakUtils from "../streakUtils.js";
import type * as templates from "../templates.js";
import type * as testStrength from "../testStrength.js";
import type * as tracking from "../tracking.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  articles: typeof articles;
  auth: typeof auth;
  categories: typeof categories;
  character: typeof character;
  debugHabitStrength: typeof debugHabitStrength;
  diagnose: typeof diagnose;
  habitStrength: typeof habitStrength;
  habits: typeof habits;
  http: typeof http;
  initializeAllHabitsStrength: typeof initializeAllHabitsStrength;
  migration: typeof migration;
  notes: typeof notes;
  predictions: typeof predictions;
  quickFix: typeof quickFix;
  recalculateAllHabitsStrength: typeof recalculateAllHabitsStrength;
  router: typeof router;
  settings: typeof settings;
  streakUtils: typeof streakUtils;
  templates: typeof templates;
  testStrength: typeof testStrength;
  tracking: typeof tracking;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
