/**
 * Expo Config Plugin: withHabitStreaksWidget
 *
 * Configures the iOS project for the HabitStreaksWidget extension:
 * 1. Adds App Group capability to the main app target
 * 2. Documents the widget extension target setup (must be added in Xcode)
 *
 * Usage in app.json:
 *   "plugins": ["./plugins/withHabitStreaksWidget"]
 */

const { withEntitlementsPlist, withInfoPlist } = require("expo/config-plugins");

function withAppGroupEntitlement(config) {
  return withEntitlementsPlist(config, (mod) => {
    const APP_GROUP = "group.com.chainday.app.shared";
    if (!mod.modResults["com.apple.security.application-groups"]) {
      mod.modResults["com.apple.security.application-groups"] = [];
    }
    const groups = mod.modResults["com.apple.security.application-groups"];
    if (!groups.includes(APP_GROUP)) {
      groups.push(APP_GROUP);
    }
    return mod;
  });
}

function withBackgroundFetch(config) {
  return withInfoPlist(config, (mod) => {
    if (!mod.modResults.UIBackgroundModes) {
      mod.modResults.UIBackgroundModes = [];
    }
    if (!mod.modResults.UIBackgroundModes.includes("fetch")) {
      mod.modResults.UIBackgroundModes.push("fetch");
    }
    return mod;
  });
}

module.exports = function withHabitStreaksWidget(config) {
  config = withAppGroupEntitlement(config);
  config = withBackgroundFetch(config);
  return config;
};
