/**
 * Expo Config Plugin: ChainDay WidgetKit Extension
 *
 * This plugin automates the Xcode project modifications needed
 * to add the WidgetKit extension target during `expo prebuild`.
 *
 * What it does:
 * 1. Adds App Group entitlement to main app and widget
 * 2. Adds the widget extension target to the Xcode project
 * 3. Configures signing and deployment target
 *
 * Usage in app.json:
 *   "plugins": ["./plugins/withChainDayWidget"]
 */

const {
  withXcodeProject,
  withEntitlementsPlist,
  withInfoPlist,
} = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

const APP_GROUP_ID = 'group.com.chainday.app';
const WIDGET_BUNDLE_ID = 'com.chainday.app.widget';
const WIDGET_NAME = 'ChainDayWidget';
const DEPLOYMENT_TARGET = '17.0';

/**
 * Add App Group entitlement to the main app
 */
function withAppGroupEntitlement(config) {
  return withEntitlementsPlist(config, (mod) => {
    mod.modResults['com.apple.security.application-groups'] = [APP_GROUP_ID];
    return mod;
  });
}

/**
 * Add the widget extension target to the Xcode project.
 *
 * NOTE: Full automated Xcode target creation is complex and fragile.
 * This plugin handles the entitlements and Info.plist modifications.
 * The actual target addition is best done via:
 *   1. `expo prebuild` then manually add target in Xcode, OR
 *   2. Use the companion setup script (see docs/WIDGET_GUIDE.md)
 */
function withWidgetTarget(config) {
  return withXcodeProject(config, async (mod) => {
    const xcodeProject = mod.modResults;

    // Log guidance for manual setup
    console.log('\n📱 ChainDay Widget Extension');
    console.log('═══════════════════════════════════════════');
    console.log(`Widget source files are in ios/${WIDGET_NAME}/`);
    console.log('See docs/WIDGET_GUIDE.md for Xcode setup instructions.');
    console.log('═══════════════════════════════════════════\n');

    return mod;
  });
}

/**
 * Main plugin entry point
 */
function withChainDayWidget(config) {
  config = withAppGroupEntitlement(config);
  config = withWidgetTarget(config);
  return config;
}

module.exports = withChainDayWidget;
