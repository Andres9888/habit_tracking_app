/**
 * Expo Config Plugin: withSiriShortcuts
 *
 * Configures the iOS project for Siri Shortcuts support:
 * - Adds NSUserActivityTypes to Info.plist
 * - Adds Siri entitlement
 * - Adds Siri capability to the Xcode project
 */
const {
  withInfoPlist,
  withEntitlementsPlist,
} = require('expo/config-plugins');

/** Default activity types for habit completion shortcuts */
const SIRI_ACTIVITY_TYPE = 'com.chainday.app.complete-habit';

/**
 * Add NSUserActivityTypes to Info.plist so iOS knows which
 * activities our app can handle via Siri.
 */
function withSiriInfoPlist(config) {
  return withInfoPlist(config, (cfg) => {
    const existing = cfg.modResults.NSUserActivityTypes ?? [];
    if (!existing.includes(SIRI_ACTIVITY_TYPE)) {
      cfg.modResults.NSUserActivityTypes = [
        ...existing,
        SIRI_ACTIVITY_TYPE,
      ];
    }
    return cfg;
  });
}

/**
 * Add Siri entitlement so the app can donate and handle shortcuts.
 */
function withSiriEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    cfg.modResults['com.apple.developer.siri'] = true;
    return cfg;
  });
}

/**
 * Main plugin entry point.
 */
function withSiriShortcuts(config) {
  config = withSiriInfoPlist(config);
  config = withSiriEntitlement(config);
  return config;
}

module.exports = withSiriShortcuts;
