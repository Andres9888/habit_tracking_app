const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const fs = require('fs');
const path = require('path');

// Base Expo config
const baseConfig = getDefaultConfig(__dirname);

// Ensure NativeWind's react-native-css-interop cache file exists before Metro starts.
// Metro's file map doesn't always pick up newly-created files inside node_modules during
// headless bundling (e.g. `expo export`), which can cause:
// "Failed to get the SHA-1 for: ... react-native-css-interop/.cache/web.css"
try {
  const cssInteropCacheDir = path.join(
    __dirname,
    'node_modules',
    'react-native-css-interop',
    '.cache'
  );
  const cssInteropWebCssPath = path.join(cssInteropCacheDir, 'web.css');
  fs.mkdirSync(cssInteropCacheDir, { recursive: true });
  if (!fs.existsSync(cssInteropWebCssPath)) {
    fs.writeFileSync(cssInteropWebCssPath, '');
  }
} catch (_error) {
  // Best-effort: don't fail Metro config load if filesystem is read-only.
}

// Enable NativeWind CSS/className support on native
const config = withNativeWind(baseConfig, { input: './global.css' });
const safeReactNativeUrlPolyfillAutoPath = path.join(
  __dirname,
  'src',
  'lib',
  'reactNativeUrlPolyfillAuto.js'
);

// Keep existing resolver customizations
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2', 'wav');
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Limit max workers to prevent resource exhaustion
config.maxWorkers = 2;

// Optimize resolver
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
  // Exclude test and dev directories from bundling
  blockList: [
    /\/__tests__\/.*/,
    /\/coverage\/.*/,
    /\/\.git\/.*/,
    /\/\.taskmaster\/.*/,
    /\/\.claude\/.*/,
    /\/design-mockups\/.*/,
    /\/HabitHome-FigmaCode\/.*/,
    /\/worktrees\/.*/,
    /\/\.worktrees\/.*/,
    /\/superdesign\/.*/,
    /\/\.superdesign\/.*/,
  ],
};

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-url-polyfill/auto') {
    return {
      type: 'sourceFile',
      filePath: safeReactNativeUrlPolyfillAutoPath,
    };
  }

  if (typeof defaultResolveRequest === 'function') {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Server optimization
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add caching headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return middleware(req, res, next);
    };
  },
};

// Optimize caching
config.cacheStores = [
  new (require('metro-cache').FileStore)({
    root: path.join(require('os').tmpdir(), 'metro-cache'),
  }),
];

module.exports = config;
