const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Base Expo config
const baseConfig = getDefaultConfig(__dirname);

// Enable NativeWind CSS/className support on native
const config = withNativeWind(baseConfig, { input: './global.css' });

// Keep existing resolver customizations
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Add support for react-native-worklets
config.resolver.sourceExts.push('worklet.ts', 'worklet.js', 'worklet.tsx', 'worklet.jsx');

module.exports = config;
