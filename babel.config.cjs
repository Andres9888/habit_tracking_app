/** @type {import('@babel/core').ConfigFunction} */
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
