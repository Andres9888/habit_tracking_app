/**
 * Babel plugin (scenario suite only): rewrite `import(x)` into
 * `Promise.resolve().then(() => require(x))`.
 *
 * jest-expo transforms app code with expo's internal babel preset (it ignores
 * the project babel.config.cjs), and that preset leaves native dynamic import()
 * for the bundler. Under jest's CJS runtime a real import() throws
 * ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG, so any React.lazy() component
 * (e.g. the deferred paywall/share overlays) crashes the screen. This plugin is
 * layered onto the scenario transform only — the app build and the existing
 * jest suite are untouched.
 */
module.exports = function dynamicImportToRequire({ types: t }) {
  return {
    name: 'scenario-dynamic-import-to-require',
    visitor: {
      Import(path) {
        const call = path.parentPath;
        if (!call.isCallExpression()) return;
        const arg = call.node.arguments[0];
        call.replaceWith(
          t.callExpression(
            t.memberExpression(
              t.callExpression(
                t.memberExpression(t.identifier('Promise'), t.identifier('resolve')),
                []
              ),
              t.identifier('then')
            ),
            [t.arrowFunctionExpression([], t.callExpression(t.identifier('require'), [arg]))]
          )
        );
      },
    },
  };
};
