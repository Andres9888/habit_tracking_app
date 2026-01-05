# Uniwind Migration - Phase 2: Config Migration

> **Focus**: Metro, Babel, and Tailwind configuration files
> **Key Change**: `withNativeWind()` → `withUniwindConfig()`

## Phase 2 Tasks: Configuration File Updates

### 2.1 Update Metro Configuration

**File**: `metro.config.cjs`

- [ ] Replace NativeWind wrapper with Uniwind wrapper:

**Before:**
```javascript
const { withNativeWind } = require('nativewind/metro');
// ...
const config = withNativeWind(baseConfig, { input: './global.css' });
```

**After:**
```javascript
const { withUniwindConfig } = require('uniwind/metro');
// ...
const config = withUniwindConfig(baseConfig, { input: './global.css' });
```

- [ ] Remove the `react-native-css-interop` cache directory creation code (lines 13-27) - no longer needed:
```javascript
// DELETE THIS ENTIRE BLOCK:
try {
  const cssInteropCacheDir = path.join(
    __dirname,
    'node_modules',
    'react-native-css-interop',
    '.cache'
  );
  // ... rest of cache handling
} catch (_error) {
  // ...
}
```

- [ ] Final `metro.config.cjs` should look like:
```javascript
const { getDefaultConfig } = require('@expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const path = require('path');

const baseConfig = getDefaultConfig(__dirname);

// Enable Uniwind CSS/className support
const config = withUniwindConfig(baseConfig, { input: './global.css' });

// Keep existing resolver customizations
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Limit max workers to prevent resource exhaustion
config.maxWorkers = 2;

// Optimize resolver
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
  blockList: [
    /\/__tests__\/.*/,
    /\/coverage\/.*/,
    /\/\.git\/.*/,
    /\/\.taskmaster\/.*/,
    /\/\.claude\/.*/,
    /\/design-mockups\/.*/,
    /\/HabitHome-FigmaCode\/.*/,
    /\/worktrees\/.*/,
  ],
};

// Server optimization
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
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
```

### 2.2 Update Babel Configuration

**File**: `babel.config.cjs`

- [ ] Remove `react-native-css-interop` babel plugin and JSX transform:

**Before:**
```javascript
module.exports = function (api) {
  api.cache(true);
  const cssInteropPlugin = require('react-native-css-interop/dist/babel-plugin').default;
  const plugins = [
    cssInteropPlugin,
    [
      '@babel/plugin-transform-react-jsx',
      { runtime: 'automatic', importSource: 'react-native-css-interop' },
    ],
  ];
  // ...
};
```

**After:**
```javascript
/** @type {import('@babel/core').ConfigFunction} */
module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  if (process.env.NODE_ENV === 'production') {
    plugins.push('react-native-paper/babel');
  }
  // Must be last per Reanimated docs.
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
```

> ⚠️ **Note**: Uniwind doesn't require a babel plugin - it uses Metro transforms instead.

### 2.3 Delete tailwind.config.js

- [ ] Delete `tailwind.config.js` - Tailwind 4 uses CSS-based configuration:
```bash
rm tailwind.config.js
```

> The theme configuration moves to `global.css` using `@theme` directive (Phase 3).

### 2.4 Update/Remove postcss.config.js (if exists)

- [ ] Check if `postcss.config.js` exists and update or remove:
```bash
ls postcss.config.* 2>/dev/null || echo "No postcss config found"
```

If it exists, Tailwind 4 uses a different approach. For React Native with Uniwind, PostCSS config is typically not needed as Metro handles CSS processing.

### 2.5 Clear Metro Cache

- [ ] Clear all caches to ensure clean state:
```bash
npx expo start --clear
# Or manually:
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-cache
```

## Verification

- [ ] `npx expo start` launches without Metro configuration errors
- [ ] No warnings about missing `nativewind` or `react-native-css-interop`
- [ ] Metro bundler initializes successfully

## Troubleshooting

### "Cannot find module 'uniwind/metro'"
Ensure Uniwind is installed: `npm install uniwind`

### "Metro bundler failed to start"
Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

---
**Previous Phase**: [UNIWIND_MIGRATION-1.md](./UNIWIND_MIGRATION-1.md) - Package Updates
**Next Phase**: [UNIWIND_MIGRATION-3.md](./UNIWIND_MIGRATION-3.md) - Theme Conversion
