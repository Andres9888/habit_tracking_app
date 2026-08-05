const { IOSConfig, withXcodeProject } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * Copies the canonical root privacy manifest into the generated iOS project
 * and adds it to the app target.
 */
const withPrivacyManifest = (config) => {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const projectRoot = config.modRequest.projectRoot;
    const iosDir = path.join(projectRoot, 'ios');

    const srcPath = path.join(projectRoot, 'PrivacyInfo.xcprivacy');
    const destPath = path.join(iosDir, 'PrivacyInfo.xcprivacy');
    if (!fs.existsSync(srcPath)) {
      console.warn(
        '[withPrivacyManifest] PrivacyInfo.xcprivacy not found at project root, skipping.'
      );
      return config;
    }

    fs.copyFileSync(srcPath, destPath);

    IOSConfig.XcodeUtils.ensureGroupRecursively(xcodeProject, 'Resources');
    IOSConfig.XcodeUtils.addResourceFileToGroup({
      filepath: 'PrivacyInfo.xcprivacy',
      groupName: 'Resources',
      isBuildFile: true,
      project: xcodeProject,
      verbose: true,
    });

    return config;
  });
};

module.exports = withPrivacyManifest;
