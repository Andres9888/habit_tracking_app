/**
 * Metro resolver stub for `@expo/vector-icons/MaterialCommunityIcons`.
 *
 * Why this exists: `react-native-paper` statically imports its
 * `MaterialCommunityIcon` component from `core/PaperProvider.tsx` and
 * `core/settings.tsx`, and that module calls
 * `require('@expo/vector-icons/MaterialCommunityIcons')` at module scope. Metro
 * does not tree-shake, so merely mounting `<PaperProvider>` pulls in the
 * 1.3MB `MaterialCommunityIcons.ttf` asset.
 *
 * This app renders zero Material Community icons — all iconography is
 * `lucide-react-native` — and Paper is used only for its theme plumbing
 * (`MD3LightTheme`, `configureFonts`, `useTheme`) plus a handful of unstyled
 * primitives. So the font is pure dead weight.
 *
 * Wired up in `metro.config.cjs` via `resolver.resolveRequest`. If a Paper
 * component that renders an icon is ever introduced, this stub warns in dev
 * rather than failing silently.
 */

function MaterialCommunityIconsStub(props) {
  if (__DEV__) {
    console.warn(
      `[materialCommunityIconsStub] A react-native-paper component tried to render ` +
        `the Material Community icon "${props?.name}", but @expo/vector-icons is stubbed ` +
        `out to keep the 1.3MB icon font out of the bundle. Pass a lucide-based ` +
        `renderer via <PaperProvider settings={{ icon }}>, or drop the stub from ` +
        `metro.config.cjs if Paper icons are now required.`
    );
  }

  return null;
}

MaterialCommunityIconsStub.displayName = 'MaterialCommunityIconsStub';

// `getImageSource` / `loadFont` are part of the vector-icons surface; provide
// inert versions so any incidental call site does not throw.
MaterialCommunityIconsStub.getImageSource = () => Promise.resolve(null);
MaterialCommunityIconsStub.loadFont = () => Promise.resolve();
MaterialCommunityIconsStub.font = {};

module.exports = MaterialCommunityIconsStub;
module.exports.default = MaterialCommunityIconsStub;
module.exports.__esModule = true;
