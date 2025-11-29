const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Base Expo config
const baseConfig = getDefaultConfig(__dirname);

// Enable NativeWind CSS/className support on native
const config = withNativeWind(baseConfig, { input: './global.css' });

// Keep existing resolver customizations
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');
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
  ],
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
    root: require('path').join(require('os').tmpdir(), 'metro-cache'),
  }),
];

module.exports = config;
