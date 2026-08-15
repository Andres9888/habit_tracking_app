import { readFile } from 'node:fs/promises';

const [
  appJsonSource,
  infoPlist,
  xcodeProject,
  androidBuild,
  androidManifest,
  androidStrings,
] = await Promise.all([
  readFile(new URL('../app.json', import.meta.url), 'utf8'),
  readFile(new URL('../ios/ChainDay/Info.plist', import.meta.url), 'utf8'),
  readFile(
    new URL('../ios/ChainDay.xcodeproj/project.pbxproj', import.meta.url),
    'utf8'
  ),
  readFile(new URL('../android/app/build.gradle', import.meta.url), 'utf8'),
  readFile(
    new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url),
    'utf8'
  ),
  readFile(
    new URL('../android/app/src/main/res/values/strings.xml', import.meta.url),
    'utf8'
  ),
]);

const app = JSON.parse(appJsonSource).expo;
const failures = [];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function expectMatch(label, source, expression, expected) {
  const matches = [...source.matchAll(expression)].map((match) => match[1]);

  if (matches.length === 0) {
    failures.push(`${label}: value was not found`);
    return;
  }

  const mismatches = [...new Set(matches)].filter(
    (value) => value !== expected
  );
  if (mismatches.length > 0) {
    failures.push(
      `${label}: expected ${JSON.stringify(expected)}, found ${mismatches
        .map((value) => JSON.stringify(value))
        .join(', ')}`
    );
  }
}

function plistString(key) {
  return new RegExp(
    `<key>${escapeRegExp(key)}</key>\\s*<string>([^<]+)</string>`,
    'g'
  );
}

function plistArray(key) {
  const match = infoPlist.match(
    new RegExp(`<key>${escapeRegExp(key)}</key>\\s*<array>([\\s\\S]*?)</array>`)
  );

  return match
    ? [...match[1].matchAll(/<string>([^<]+)<\/string>/g)].map(
        (entry) => entry[1]
      )
    : null;
}

expectMatch(
  'iOS display name',
  infoPlist,
  plistString('CFBundleDisplayName'),
  app.name
);
expectMatch(
  'iOS marketing version',
  infoPlist,
  plistString('CFBundleShortVersionString'),
  app.version
);
expectMatch(
  'iOS build number',
  infoPlist,
  plistString('CFBundleVersion'),
  app.ios.buildNumber
);
expectMatch(
  'Xcode marketing version',
  xcodeProject,
  /MARKETING_VERSION = ([^;]+);/g,
  app.version
);
expectMatch(
  'Xcode build number',
  xcodeProject,
  /CURRENT_PROJECT_VERSION = ([^;]+);/g,
  app.ios.buildNumber
);
expectMatch(
  'Xcode bundle identifier',
  xcodeProject,
  /PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/g,
  app.ios.bundleIdentifier
);

for (const [key, expected] of Object.entries(app.ios.infoPlist ?? {})) {
  if (typeof expected === 'string') {
    expectMatch(`iOS Info.plist ${key}`, infoPlist, plistString(key), expected);
    continue;
  }

  if (Array.isArray(expected)) {
    const actual = plistArray(key);
    if (actual === null) {
      failures.push(`iOS Info.plist ${key}: value was not found`);
      continue;
    }

    const missing = expected.filter((value) => !actual.includes(value));
    if (missing.length > 0) {
      failures.push(
        `iOS Info.plist ${key}: missing ${missing
          .map((value) => JSON.stringify(value))
          .join(', ')}`
      );
    }
  }
}

if (!infoPlist.includes(`<string>${app.scheme}</string>`)) {
  failures.push(`iOS URL scheme: expected ${JSON.stringify(app.scheme)}`);
}

const expectedDeviceFamily = app.ios.supportsTablet ? '1,2' : '1';
expectMatch(
  'Xcode targeted device family',
  xcodeProject,
  /TARGETED_DEVICE_FAMILY = "?([^";]+)"?;/g,
  expectedDeviceFamily
);

expectMatch(
  'Android namespace',
  androidBuild,
  /namespace ['"]([^'"]+)['"]/g,
  app.android.package
);
expectMatch(
  'Android application ID',
  androidBuild,
  /applicationId ['"]([^'"]+)['"]/g,
  app.android.package
);
expectMatch(
  'Android version name',
  androidBuild,
  /versionName ['"]([^'"]+)['"]/g,
  app.version
);

if (!androidManifest.includes(`android:scheme="${app.scheme}"`)) {
  failures.push(`Android URL scheme: expected ${JSON.stringify(app.scheme)}`);
}

if (!androidManifest.includes('android:screenOrientation="portrait"')) {
  failures.push('Android orientation: expected "portrait"');
}

if (!androidStrings.includes(`<string name="app_name">${app.name}</string>`)) {
  failures.push(`Android app name: expected ${JSON.stringify(app.name)}`);
}

if (
  !androidStrings.includes(
    `<string name="expo_system_ui_user_interface_style" translatable="false">${app.userInterfaceStyle}</string>`
  )
) {
  failures.push(
    `Android user interface style: expected ${JSON.stringify(app.userInterfaceStyle)}`
  );
}

if (failures.length > 0) {
  console.error('Native configuration differs from app.json:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Native release configuration matches app.json.');
}
