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
import type * as affirmations from "../affirmations.js";
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
import type * as letters from "../letters.js";
import type * as migrateHabitsToUser from "../migrateHabitsToUser.js";
import type * as migration from "../migration.js";
import type * as notes from "../notes.js";
import type * as predictions from "../predictions.js";
import type * as quickFix from "../quickFix.js";
import type * as recalculateAllHabitsStrength from "../recalculateAllHabitsStrength.js";
import type * as reflections from "../reflections.js";
import type * as router from "../router.js";
import type * as settings from "../settings.js";
import type * as storage from "../storage.js";
import type * as streakUtils from "../streakUtils.js";
import type * as templates from "../templates.js";
import type * as testStrength from "../testStrength.js";
import type * as tracking from "../tracking.js";
import type * as users from "../users.js";
import type * as visionBoard from "../visionBoard.js";
import type * as visionBoardImages from "../visionBoardImages.js";
import type * as voiceNotes from "../voiceNotes.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  affirmations: typeof affirmations;
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
  letters: typeof letters;
  migrateHabitsToUser: typeof migrateHabitsToUser;
  migration: typeof migration;
  notes: typeof notes;
  predictions: typeof predictions;
  quickFix: typeof quickFix;
  recalculateAllHabitsStrength: typeof recalculateAllHabitsStrength;
  reflections: typeof reflections;
  router: typeof router;
  settings: typeof settings;
  storage: typeof storage;
  streakUtils: typeof streakUtils;
  templates: typeof templates;
  testStrength: typeof testStrength;
  tracking: typeof tracking;
  users: typeof users;
  visionBoard: typeof visionBoard;
  visionBoardImages: typeof visionBoardImages;
  voiceNotes: typeof voiceNotes;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
