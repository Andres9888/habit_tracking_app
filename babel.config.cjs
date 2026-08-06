/** @type {import('@babel/core').ConfigFunction} */
module.exports = function (api) {
  const isTest = api.env('test');
  const plugins = [];

  // Jest does not need NativeWind's JSX rewrite, and applying it to mock
  // factories introduces an out-of-scope import that Jest's hoist guard rejects.
  if (!isTest) {
    const cssInteropPlugin =
      require('react-native-css-interop/dist/babel-plugin').default;
    plugins.push(cssInteropPlugin, [
      '@babel/plugin-transform-react-jsx',
      { runtime: 'automatic', importSource: 'react-native-css-interop' },
    ]);
  }

  if (process.env.NODE_ENV === 'production') {
    // Metro does not tree-shake package barrels. Rewrite Lucide's named exports
    // to their individual icon modules so production bundles include only the
    // icons the app actually uses.
    plugins.push('./scripts/babel/lucide-direct-imports.cjs');
    plugins.push('react-native-paper/babel');
  }
  // Must be last per Reanimated docs.
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
