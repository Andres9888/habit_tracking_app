import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '../../..');
const USAGE_KEY = 'NSUserNotificationsUsageDescription';
const USAGE_TEXT =
  'Chain Day sends habit reminders and streak alerts you choose to help you stay consistent.';

function pngSize(filePath: string): { height: number; width: number } {
  const buf = readFileSync(filePath);
  expect(buf.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  return { height: buf.readUInt32BE(20), width: buf.readUInt32BE(16) };
}

function plistValue(plist: string, key: string): string {
  const match = plist.match(
    new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`)
  );
  return match?.[1] ?? '';
}

describe('App Store splash and notification config', () => {
  const app = JSON.parse(readFileSync(join(ROOT, 'app.json'), 'utf8'));
  const splashPlugin = app.expo.plugins.find(
    (plugin: unknown) =>
      Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
  )?.[1];

  it('ships a real 2048 splash generated from the app icon', () => {
    const splash = join(ROOT, 'assets/splash.png');
    const { height, width } = pngSize(splash);
    expect(readFileSync(splash).length).toBeGreaterThan(10_000);
    expect(width).toBe(2048);
    expect(height).toBe(2048);
  });

  it('points Expo splash config at the splash asset and brand green', () => {
    expect(app.expo.splash).toMatchObject({
      backgroundColor: '#059669',
      image: './assets/splash.png',
      resizeMode: 'contain',
    });
    expect(splashPlugin).toMatchObject({
      backgroundColor: '#059669',
      image: './assets/splash.png',
      imageWidth: 200,
      resizeMode: 'contain',
    });
  });

  it('uses the current icon for the committed iOS launch imageset', () => {
    const imageset = join(
      ROOT,
      'ios/ChainDay/Images.xcassets/SplashScreenLogo.imageset'
    );
    expect(pngSize(join(imageset, 'image.png'))).toEqual({
      height: 200,
      width: 200,
    });
    expect(pngSize(join(imageset, 'image@2x.png'))).toEqual({
      height: 400,
      width: 400,
    });
    expect(pngSize(join(imageset, 'image@3x.png'))).toEqual({
      height: 600,
      width: 600,
    });
  });

  it('ships an honest Chain Day notification usage description', () => {
    const plist = readFileSync(join(ROOT, 'ios/ChainDay/Info.plist'), 'utf8');
    expect(app.expo.ios.infoPlist[USAGE_KEY]).toBe(USAGE_TEXT);
    expect(plistValue(plist, USAGE_KEY)).toBe(USAGE_TEXT);
    expect(USAGE_TEXT).toMatch(/Chain Day/);
    expect(USAGE_TEXT).not.toMatch(/motivation messages/i);
  });
});
