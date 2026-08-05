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
import type * as analytics_helpers from "../analytics/helpers.js";
import type * as analytics_index from "../analytics/index.js";
import type * as analytics_streakHelpers from "../analytics/streakHelpers.js";
import type * as analytics_types from "../analytics/types.js";
import type * as analytics_weeklyHelpers from "../analytics/weeklyHelpers.js";
import type * as analytics from "../analytics.js";
import type * as analyticsCompliance from "../analyticsCompliance.js";
import type * as analyticsDistribution from "../analyticsDistribution.js";
import type * as analyticsOverview from "../analyticsOverview.js";
import type * as analyticsTrend from "../analyticsTrend.js";
import type * as analyticsWeekly from "../analyticsWeekly.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as config_apiConstants from "../config/apiConstants.js";
import type * as crons from "../crons.js";
import type * as deleteCurrentUserData from "../deleteCurrentUserData.js";
import type * as deleteUserStorage from "../deleteUserStorage.js";
import type * as habitStrength_algorithmConfig from "../habitStrength/algorithmConfig.js";
import type * as habitStrength_allHabitsStats from "../habitStrength/allHabitsStats.js";
import type * as habitStrength_compliance from "../habitStrength/compliance.js";
import type * as habitStrength_constants from "../habitStrength/constants.js";
import type * as habitStrength_dateUtils from "../habitStrength/dateUtils.js";
import type * as habitStrength_getStrengthInfo from "../habitStrength/getStrengthInfo.js";
import type * as habitStrength_legacyFormula from "../habitStrength/legacyFormula.js";
import type * as habitStrength_logistic from "../habitStrength/logistic.js";
import type * as habitStrength_momentum from "../habitStrength/momentum.js";
import type * as habitStrength_recalculate from "../habitStrength/recalculate.js";
import type * as habitStrength_snapshot from "../habitStrength/snapshot.js";
import type * as habitStrength_strengthLevel from "../habitStrength/strengthLevel.js";
import type * as habitStrength_types from "../habitStrength/types.js";
import type * as habitStrength_updateParams from "../habitStrength/updateParams.js";
import type * as habitStrength_updateStrength from "../habitStrength/updateStrength.js";
import type * as habitStrength from "../habitStrength.js";
import type * as habits_archive from "../habits/archive.js";
import type * as habits_batchArchive from "../habits/batchArchive.js";
import type * as habits_batchGuards from "../habits/batchGuards.js";
import type * as habits_batchRemove from "../habits/batchRemove.js";
import type * as habits_cleanupLegacyGoalFields from "../habits/cleanupLegacyGoalFields.js";
import type * as habits_create from "../habits/create.js";
import type * as habits_deleteTrackingChunk from "../habits/deleteTrackingChunk.js";
import type * as habits_get from "../habits/get.js";
import type * as habits_getTracking from "../habits/getTracking.js";
import type * as habits_list from "../habits/list.js";
import type * as habits_listHabitValidator from "../habits/listHabitValidator.js";
import type * as habits_pause from "../habits/pause.js";
import type * as habits_pauseRecalculation from "../habits/pauseRecalculation.js";
import type * as habits_recalcStaleArgs from "../habits/recalcStaleArgs.js";
import type * as habits_recalcStaleHelpers from "../habits/recalcStaleHelpers.js";
import type * as habits_recalculateStaleStrength from "../habits/recalculateStaleStrength.js";
import type * as habits_remove from "../habits/remove.js";
import type * as habits_reorder from "../habits/reorder.js";
import type * as habits_stats from "../habits/stats.js";
import type * as habits_toggle from "../habits/toggle.js";
import type * as habits_types from "../habits/types.js";
import type * as habits_update from "../habits/update.js";
import type * as habits_utils from "../habits/utils.js";
import type * as habits_validateHabitUpdateFields from "../habits/validateHabitUpdateFields.js";
import type * as habits_validation from "../habits/validation.js";
import type * as habits_validators from "../habits/validators.js";
import type * as habits from "../habits.js";
import type * as http from "../http.js";
import type * as lib_inputValidation from "../lib/inputValidation.js";
import type * as lib_progressEmojisValidator from "../lib/progressEmojisValidator.js";
import type * as lib_rateLimit from "../lib/rateLimit.js";
import type * as router from "../router.js";
import type * as settings_getResponse from "../settings/getResponse.js";
import type * as settings_normalizers from "../settings/normalizers.js";
import type * as settings_settings from "../settings/settings.js";
import type * as settings_types from "../settings/types.js";
import type * as settings_validators from "../settings/validators.js";
import type * as settings from "../settings.js";
import type * as storage from "../storage.js";
import type * as storageOwnership from "../storageOwnership.js";
import type * as storageValidation from "../storageValidation.js";
import type * as streakUtils_dateHelpers from "../streakUtils/dateHelpers.js";
import type * as streakUtils_historyCalculation from "../streakUtils/historyCalculation.js";
import type * as streakUtils_index from "../streakUtils/index.js";
import type * as streakUtils_types from "../streakUtils/types.js";
import type * as streakUtils_updateStreak from "../streakUtils/updateStreak.js";
import type * as streakUtils from "../streakUtils.js";
import type * as subscriptions_helpers from "../subscriptions/helpers.js";
import type * as subscriptions_premiumCheck from "../subscriptions/premiumCheck.js";
import type * as subscriptions from "../subscriptions.js";
import type * as templateCategories from "../templateCategories.js";
import type * as templates_backfillEstimatedMinutes from "../templates/backfillEstimatedMinutes.js";
import type * as templates_clearAndDedupe from "../templates/clearAndDedupe.js";
import type * as templates_curateTemplates from "../templates/curateTemplates.js";
import type * as templates_curatedEnrichment from "../templates/curatedEnrichment.js";
import type * as templates_curatedRemovals from "../templates/curatedRemovals.js";
import type * as templates_curatedSeedTemplates from "../templates/curatedSeedTemplates.js";
import type * as templates_curation from "../templates/curation.js";
import type * as templates_enrichTemplates from "../templates/enrichTemplates.js";
import type * as templates_helpers from "../templates/helpers.js";
import type * as templates_importTemplate from "../templates/importTemplate.js";
import type * as templates_importTemplateCustomizations from "../templates/importTemplateCustomizations.js";
import type * as templates_importTemplateHandler from "../templates/importTemplateHandler.js";
import type * as templates_popularity from "../templates/popularity.js";
import type * as templates_queries from "../templates/queries.js";
import type * as templates_seedCurationTemplates from "../templates/seedCurationTemplates.js";
import type * as templates_seedMutations from "../templates/seedMutations.js";
import type * as templates_types from "../templates/types.js";
import type * as templates_updateLinks from "../templates/updateLinks.js";
import type * as templates from "../templates.js";
import type * as templatesDataSeed from "../templatesDataSeed.js";
import type * as tracking_getCompletionStatus from "../tracking/getCompletionStatus.js";
import type * as tracking_helpers from "../tracking/helpers.js";
import type * as tracking_index from "../tracking/index.js";
import type * as tracking_strengthUpdater from "../tracking/strengthUpdater.js";
import type * as tracking from "../tracking.js";
import type * as users from "../users.js";
import type * as usersProfileImage from "../usersProfileImage.js";
import type * as webhooks_handleRevenueCatWebhook from "../webhooks/handleRevenueCatWebhook.js";
import type * as webhooks_revenuecat from "../webhooks/revenuecat.js";
import type * as webhooks_revenuecatEvent from "../webhooks/revenuecatEvent.js";
import type * as webhooks_revenuecatSignature from "../webhooks/revenuecatSignature.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "analytics/helpers": typeof analytics_helpers;
  "analytics/index": typeof analytics_index;
  "analytics/streakHelpers": typeof analytics_streakHelpers;
  "analytics/types": typeof analytics_types;
  "analytics/weeklyHelpers": typeof analytics_weeklyHelpers;
  analytics: typeof analytics;
  analyticsCompliance: typeof analyticsCompliance;
  analyticsDistribution: typeof analyticsDistribution;
  analyticsOverview: typeof analyticsOverview;
  analyticsTrend: typeof analyticsTrend;
  analyticsWeekly: typeof analyticsWeekly;
  auth: typeof auth;
  categories: typeof categories;
  "config/apiConstants": typeof config_apiConstants;
  crons: typeof crons;
  deleteCurrentUserData: typeof deleteCurrentUserData;
  deleteUserStorage: typeof deleteUserStorage;
  "habitStrength/algorithmConfig": typeof habitStrength_algorithmConfig;
  "habitStrength/allHabitsStats": typeof habitStrength_allHabitsStats;
  "habitStrength/compliance": typeof habitStrength_compliance;
  "habitStrength/constants": typeof habitStrength_constants;
  "habitStrength/dateUtils": typeof habitStrength_dateUtils;
  "habitStrength/getStrengthInfo": typeof habitStrength_getStrengthInfo;
  "habitStrength/legacyFormula": typeof habitStrength_legacyFormula;
  "habitStrength/logistic": typeof habitStrength_logistic;
  "habitStrength/momentum": typeof habitStrength_momentum;
  "habitStrength/recalculate": typeof habitStrength_recalculate;
  "habitStrength/snapshot": typeof habitStrength_snapshot;
  "habitStrength/strengthLevel": typeof habitStrength_strengthLevel;
  "habitStrength/types": typeof habitStrength_types;
  "habitStrength/updateParams": typeof habitStrength_updateParams;
  "habitStrength/updateStrength": typeof habitStrength_updateStrength;
  habitStrength: typeof habitStrength;
  "habits/archive": typeof habits_archive;
  "habits/batchArchive": typeof habits_batchArchive;
  "habits/batchGuards": typeof habits_batchGuards;
  "habits/batchRemove": typeof habits_batchRemove;
  "habits/cleanupLegacyGoalFields": typeof habits_cleanupLegacyGoalFields;
  "habits/create": typeof habits_create;
  "habits/deleteTrackingChunk": typeof habits_deleteTrackingChunk;
  "habits/get": typeof habits_get;
  "habits/getTracking": typeof habits_getTracking;
  "habits/list": typeof habits_list;
  "habits/listHabitValidator": typeof habits_listHabitValidator;
  "habits/pause": typeof habits_pause;
  "habits/pauseRecalculation": typeof habits_pauseRecalculation;
  "habits/recalcStaleArgs": typeof habits_recalcStaleArgs;
  "habits/recalcStaleHelpers": typeof habits_recalcStaleHelpers;
  "habits/recalculateStaleStrength": typeof habits_recalculateStaleStrength;
  "habits/remove": typeof habits_remove;
  "habits/reorder": typeof habits_reorder;
  "habits/stats": typeof habits_stats;
  "habits/toggle": typeof habits_toggle;
  "habits/types": typeof habits_types;
  "habits/update": typeof habits_update;
  "habits/utils": typeof habits_utils;
  "habits/validateHabitUpdateFields": typeof habits_validateHabitUpdateFields;
  "habits/validation": typeof habits_validation;
  "habits/validators": typeof habits_validators;
  habits: typeof habits;
  http: typeof http;
  "lib/inputValidation": typeof lib_inputValidation;
  "lib/progressEmojisValidator": typeof lib_progressEmojisValidator;
  "lib/rateLimit": typeof lib_rateLimit;
  router: typeof router;
  "settings/getResponse": typeof settings_getResponse;
  "settings/normalizers": typeof settings_normalizers;
  "settings/settings": typeof settings_settings;
  "settings/types": typeof settings_types;
  "settings/validators": typeof settings_validators;
  settings: typeof settings;
  storage: typeof storage;
  storageOwnership: typeof storageOwnership;
  storageValidation: typeof storageValidation;
  "streakUtils/dateHelpers": typeof streakUtils_dateHelpers;
  "streakUtils/historyCalculation": typeof streakUtils_historyCalculation;
  "streakUtils/index": typeof streakUtils_index;
  "streakUtils/types": typeof streakUtils_types;
  "streakUtils/updateStreak": typeof streakUtils_updateStreak;
  streakUtils: typeof streakUtils;
  "subscriptions/helpers": typeof subscriptions_helpers;
  "subscriptions/premiumCheck": typeof subscriptions_premiumCheck;
  subscriptions: typeof subscriptions;
  templateCategories: typeof templateCategories;
  "templates/backfillEstimatedMinutes": typeof templates_backfillEstimatedMinutes;
  "templates/clearAndDedupe": typeof templates_clearAndDedupe;
  "templates/curateTemplates": typeof templates_curateTemplates;
  "templates/curatedEnrichment": typeof templates_curatedEnrichment;
  "templates/curatedRemovals": typeof templates_curatedRemovals;
  "templates/curatedSeedTemplates": typeof templates_curatedSeedTemplates;
  "templates/curation": typeof templates_curation;
  "templates/enrichTemplates": typeof templates_enrichTemplates;
  "templates/helpers": typeof templates_helpers;
  "templates/importTemplate": typeof templates_importTemplate;
  "templates/importTemplateCustomizations": typeof templates_importTemplateCustomizations;
  "templates/importTemplateHandler": typeof templates_importTemplateHandler;
  "templates/popularity": typeof templates_popularity;
  "templates/queries": typeof templates_queries;
  "templates/seedCurationTemplates": typeof templates_seedCurationTemplates;
  "templates/seedMutations": typeof templates_seedMutations;
  "templates/types": typeof templates_types;
  "templates/updateLinks": typeof templates_updateLinks;
  templates: typeof templates;
  templatesDataSeed: typeof templatesDataSeed;
  "tracking/getCompletionStatus": typeof tracking_getCompletionStatus;
  "tracking/helpers": typeof tracking_helpers;
  "tracking/index": typeof tracking_index;
  "tracking/strengthUpdater": typeof tracking_strengthUpdater;
  tracking: typeof tracking;
  users: typeof users;
  usersProfileImage: typeof usersProfileImage;
  "webhooks/handleRevenueCatWebhook": typeof webhooks_handleRevenueCatWebhook;
  "webhooks/revenuecat": typeof webhooks_revenuecat;
  "webhooks/revenuecatEvent": typeof webhooks_revenuecatEvent;
  "webhooks/revenuecatSignature": typeof webhooks_revenuecatSignature;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
