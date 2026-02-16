/**
 * Expo Config Plugin: iOS Widget Extension
 * 
 * This plugin configures the iOS widget extension for ChainDay.
 * It adds the necessary entitlements for App Groups and prepares
 * the native project for the widget extension target.
 * 
 * Usage in app.json:
 * {
 *   "plugins": [
 *     "./plugins/withWidgetExtension.js"
 *   ]
 * }
 * 
 * @see https://docs.expo.dev/guides/config-plugins/
 */

const {
  withEntitlementsPlist,
  withInfoPlist,
} = require('@expo/config-plugins');

const APP_GROUP_ID = 'group.com.chainday.app.shared';

/**
 * Add App Group entitlement to iOS
 */
const withAppGroups = (config) => {
  return withEntitlementsPlist(config, (config) => {
    if (!config.modResults['com.apple.security.application-groups']) {
      config.modResults['com.apple.security.application-groups'] = [];
    }
    
    const appGroups = config.modResults['com.apple.security.application-groups'];
    if (!appGroups.includes(APP_GROUP_ID)) {
      appGroups.push(APP_GROUP_ID);
    }

    return config;
  });
};

/**
 * Add widget-related Info.plist entries
 */
const withWidgetInfo = (config) => {
  return withInfoPlist(config, (config) => {
    // Add any widget-specific plist configurations here
    // For example, background modes for widget updates
    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = [];
    }
    
    const bgModes = config.modResults.UIBackgroundModes;
    if (!bgModes.includes('fetch')) {
      bgModes.push('fetch');
    }

    return config;
  });
};

/**
 * Main plugin function
 */
module.exports = (config) => {
  config = withAppGroups(config);
  config = withWidgetInfo(config);
  return config;
};
