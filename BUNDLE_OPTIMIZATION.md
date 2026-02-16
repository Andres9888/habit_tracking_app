# Bundle Size Optimization Report

## Dependencies Removed

### Unused Dependencies (18 packages)

1. `vibe-kanban-web-companion` - No usage found in codebase
2. `claude-mem` - No usage found in codebase
3. `bmad-method` - No usage found in codebase
4. `react-calendar` - No usage found in codebase
5. `reanimated-color-picker` - Only mocks/type declarations, no actual usage
6. `@react-navigation/bottom-tabs` - Not used (app uses custom tab navigation)
7. `@react-navigation/native` - Not used (app uses custom navigation)
8. `@shopify/react-native-skia` - Not imported anywhere
9. `react-native-worklets` - Not imported anywhere
10. `@auth/core` - Not imported anywhere
11. `@notifee/react-native` - Not imported anywhere
12. `expo-auth-session` - Not imported anywhere
13. `expo-font` - Not imported anywhere
14. `expo-status-bar` - Not imported anywhere
15. `react-native-calendars` - Not imported anywhere
16. `react-native-get-random-values` - Not imported anywhere
17. `react-native-screens` - Not imported anywhere
18. `react-native-web` - Not imported anywhere

**Total packages removed: 18**

## Image Asset Optimization Recommendations

### Critical: Splash Screen Images (HUGE savings potential)

The splash screen images are massively oversized:

1. **iOS SplashScreenLegacy images**: 3 files × 6.6MB = **19.8MB total**
   - Location: `ios/ChainDay/Images.xcassets/SplashScreenLegacy.imageset/`
   - Files: `image.png`, `image@2x.png`, `image@3x.png`
   - All are 6.6MB each (likely duplicates or unoptimized)

2. **Main splash.png**: **5.6MB** (2048×2048)
   - Location: `assets/splash.png`
   - Current: 2048×2048 PNG, unoptimized
   - Recommendation: Optimize with pngquant/optipng, should be ~500KB-1MB

3. **App icons**: **~2.2MB** combined
   - `assets/icon.png` - 1.1MB
   - `assets/adaptive-icon.png` - 1.1MB
   - Recommendation: Optimize, should be ~200-300KB combined

4. **Android splash screens**: **~1.5MB** combined
   - Various densities in `android/app/src/main/res/`
   - Recommendation: Optimize each density variant

### Optimization Commands (requires ImageMagick/pngquant)

```bash
# Install tools (macOS)
brew install pngquant optipng

# Optimize splash.png
pngquant --quality=80-95 assets/splash.png -o assets/splash.png.tmp
optipng -o7 assets/splash.png.tmp
mv assets/splash.png.tmp assets/splash.png

# Optimize icons
pngquant --quality=80-95 assets/icon.png -o assets/icon.png.tmp
optipng -o7 assets/icon.png.tmp
mv assets/icon.png.tmp assets/icon.png

# Similar for adaptive-icon and iOS/Android variants
```

**Estimated image savings: 20-25MB → ~3-4MB** (80-85% reduction)

## Import Analysis

### Icon Libraries (Dual Usage - Potential Consolidation)

- **lucide-react-native**: 306 imports (heavily used) ✅
- **@expo/vector-icons** (Ionicons): 21 imports

**Recommendation**: Consider migrating the 21 Ionicons imports to Lucide equivalents to remove `@expo/vector-icons` dependency. This would save ~2-3MB.

**Migration difficulty**: Low-Medium (21 files to update)

### Large Dependencies Currently Used (Keep)

- `victory-native` - Used for charts (TrendLineChart, StrengthDistributionChart)
- `sonner` - Used for web toasts (platform-specific)
- `openai` - Used in Convex backend (affirmationsAI)
- `date-fns` - Date utilities (widely used)

These are all legitimately needed.

## Summary

### Immediate Wins (This PR)

- ✅ Removed 18 unused npm dependencies
- ✅ Removed unused type declaration file

### Recommended Follow-ups

1. **Image optimization** (20-25MB savings) - Use pngquant/optipng
2. **Icon library consolidation** (2-3MB savings) - Migrate Ionicons → Lucide
3. **Tree-shaking verification** - Ensure production builds use tree-shaking

### Estimated Total Savings

- **Dependencies removed**: ~5-8MB (install size) + ~2-3MB (bundle size)
- **Image optimization potential**: ~20MB (assets)
- **Icon consolidation potential**: ~2-3MB (bundle size)

**Total potential bundle reduction: ~25-30MB**
