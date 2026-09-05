/**
 * Rewrites `import { addDays, format as fmt } from 'date-fns'` into per-function
 * subpath imports (`import { addDays } from 'date-fns/addDays'`).
 *
 * Why: Metro does not tree-shake package barrels, so a single named import from
 * `date-fns` pulls the whole 44KB `date-fns/index.js` barrel — and through it,
 * all 245 date-fns modules (~162KB minified). date-fns v4 ships a subpath export
 * per function, so the barrel is avoidable entirely.
 *
 * Scope (deliberately narrow):
 *  - Only the bare `'date-fns'` specifier. `date-fns/locale`, `date-fns/fp`,
 *    `date-fns/tz`, and already-direct subpath imports are left alone.
 *  - Only value named imports. Namespace (`* as`) and default imports are left
 *    untouched, since neither maps onto a single subpath.
 *  - Type-only imports (whole-declaration or per-specifier) stay on the barrel;
 *    they are erased before bundling and cost nothing.
 *  - A named import with no matching subpath in date-fns' `exports` map stays on
 *    the barrel rather than being rewritten to a path that does not resolve.
 *
 * Modelled on `scripts/babel/lucide-direct-imports.cjs`. Registered in
 * `babel.config.cjs` for production builds only.
 */

const BARREL = 'date-fns';

let subpathExports;

function getSubpathExports() {
  if (subpathExports) return subpathExports;

  const packageJson = require('date-fns/package.json');
  subpathExports = new Set(
    Object.keys(packageJson.exports ?? {}).filter(
      (key) => key.startsWith('./') && !key.includes('*')
    )
  );

  return subpathExports;
}

function hasSubpath(name) {
  return getSubpathExports().has(`./${name}`);
}

module.exports = function dateFnsDirectImports({ types: t }) {
  return {
    name: 'date-fns-direct-imports',
    visitor: {
      ImportDeclaration(importPath) {
        const declaration = importPath.node;
        if (declaration.source.value !== BARREL) return;
        if (declaration.importKind === 'type') return;

        // Namespace / default imports have no single-subpath equivalent.
        const isNamedOnly = declaration.specifiers.every((specifier) =>
          t.isImportSpecifier(specifier)
        );
        if (!isNamedOnly || declaration.specifiers.length === 0) return;

        const replacements = [];
        const barrelSpecifiers = [];
        const typeSpecifiers = [];

        for (const specifier of declaration.specifiers) {
          if (specifier.importKind === 'type') {
            typeSpecifiers.push(specifier);
            continue;
          }

          const importedName = t.isIdentifier(specifier.imported)
            ? specifier.imported.name
            : specifier.imported.value;

          if (!hasSubpath(importedName)) {
            barrelSpecifiers.push(specifier);
            continue;
          }

          replacements.push(
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier(specifier.local.name),
                  t.identifier(importedName)
                ),
              ],
              t.stringLiteral(`${BARREL}/${importedName}`)
            )
          );
        }

        if (replacements.length === 0) return;

        if (barrelSpecifiers.length > 0) {
          replacements.unshift(
            t.importDeclaration(barrelSpecifiers, t.stringLiteral(BARREL))
          );
        }

        if (typeSpecifiers.length > 0) {
          const typeDeclaration = t.importDeclaration(
            // The `type` marker moves from the specifiers to the declaration;
            // leaving it on both emits invalid `import type { type X }`.
            typeSpecifiers.map((specifier) =>
              t.importSpecifier(
                t.identifier(specifier.local.name),
                t.isIdentifier(specifier.imported)
                  ? t.identifier(specifier.imported.name)
                  : t.stringLiteral(specifier.imported.value)
              )
            ),
            t.stringLiteral(BARREL)
          );
          typeDeclaration.importKind = 'type';
          replacements.unshift(typeDeclaration);
        }

        importPath.replaceWithMultiple(replacements);
      },
    },
  };
};
