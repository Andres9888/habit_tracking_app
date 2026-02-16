const { withXcodeProject } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

/**
 * Expo config plugin that copies PrivacyInfo.xcprivacy into the Xcode project
 * so it is included in the app bundle during EAS builds.
 */
const withPrivacyManifest = (config) => {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const projectRoot = config.modRequest.projectRoot;
    const iosDir = path.join(projectRoot, "ios");

    const srcPath = path.join(iosDir, "PrivacyInfo.xcprivacy");
    if (!fs.existsSync(srcPath)) {
      console.warn(
        "[withPrivacyManifest] PrivacyInfo.xcprivacy not found in ios/, skipping.",
      );
      return config;
    }

    // Add the file to the Xcode project if not already present
    const groupName = config.modRequest.projectName || "ChainDay";
    const group = xcodeProject.pbxGroupByName(groupName);

    if (group) {
      const alreadyExists = (group.children || []).some(
        (child) => child.comment === "PrivacyInfo.xcprivacy",
      );

      if (!alreadyExists) {
        xcodeProject.addResourceFile("PrivacyInfo.xcprivacy", {
          target: xcodeProject.getFirstTarget().uuid,
        });
        console.log(
          "[withPrivacyManifest] Added PrivacyInfo.xcprivacy to Xcode project.",
        );
      }
    }

    return config;
  });
};

module.exports = withPrivacyManifest;
