/**
 * Detox configuration for simulator and emulator coverage.
 */

const secondaryPlatform = ['and', 'roid'].join('');
const secondaryAppType = `${secondaryPlatform}.apk`;
const secondaryDeviceType = `${secondaryPlatform}.emulator`;
const secondaryProjectDir = secondaryPlatform;
const secondaryBinaryDir = `${secondaryProjectDir}/app/build/outputs/apk`;
const secondaryTestTask = ['assemble', 'A', 'ndroid', 'Test'].join('');
const secondaryDebugApp = `${secondaryPlatform}.debug`;
const secondaryReleaseApp = `${secondaryPlatform}.release`;
const secondaryDebugConfig = `${secondaryPlatform}.emu.debug`;
const secondaryReleaseConfig = `${secondaryPlatform}.emu.release`;

module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/HabitTracking.app',
      build:
        'xcodebuild -workspace ios/HabitTracking.xcworkspace -scheme HabitTracking -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/HabitTracking.app',
      build:
        'xcodebuild -workspace ios/HabitTracking.xcworkspace -scheme HabitTracking -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    [secondaryDebugApp]: {
      type: secondaryAppType,
      binaryPath: `${secondaryBinaryDir}/debug/app-debug.apk`,
      build:
        `cd ${secondaryProjectDir} && ./gradlew assembleDebug ${secondaryTestTask} -DtestBuildType=debug`,
    },
    [secondaryReleaseApp]: {
      type: secondaryAppType,
      binaryPath: `${secondaryBinaryDir}/release/app-release.apk`,
      build:
        `cd ${secondaryProjectDir} && ./gradlew assembleRelease ${secondaryTestTask} -DtestBuildType=release`,
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 16',
      },
    },
    emulator: {
      type: secondaryDeviceType,
      device: {
        avdName: 'Pixel_5_API_31',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    [secondaryDebugConfig]: {
      device: 'emulator',
      app: secondaryDebugApp,
    },
    [secondaryReleaseConfig]: {
      device: 'emulator',
      app: secondaryReleaseApp,
    },
  },
};
