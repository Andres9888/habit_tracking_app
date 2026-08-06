const fs = require('node:fs');
const path = require('node:path');

let exportPaths;

function getExportPaths() {
  if (exportPaths) return exportPaths;

  const entryPath = path.resolve(
    path.dirname(require.resolve('lucide-react-native')),
    '../esm/lucide-react-native.js'
  );
  const entryDirectory = path.dirname(entryPath);
  const entrySource = fs.readFileSync(entryPath, 'utf8');
  const result = new Map();
  const exportPattern = /^export \{ (.+) \} from '(.+)';$/gm;

  for (const match of entrySource.matchAll(exportPattern)) {
    const [, specifiers, relativePath] = match;
    const absolutePath = path.resolve(entryDirectory, relativePath);

    for (const specifier of specifiers.split(', ')) {
      const aliasMatch = /^default as (\w+)$/.exec(specifier);
      if (aliasMatch) result.set(aliasMatch[1], absolutePath);
    }
  }

  exportPaths = result;
  return result;
}

module.exports = function lucideDirectImports({ types: t }) {
  return {
    name: 'lucide-react-native-direct-imports',
    visitor: {
      ImportDeclaration(importPath) {
        const declaration = importPath.node;
        if (declaration.source.value !== 'lucide-react-native') return;
        if (declaration.importKind === 'type') return;

        const replacements = [];
        const typeSpecifiers = [];
        const paths = getExportPaths();

        for (const specifier of declaration.specifiers) {
          if (
            t.isImportSpecifier(specifier) &&
            specifier.importKind !== 'type'
          ) {
            const importedName = t.isIdentifier(specifier.imported)
              ? specifier.imported.name
              : specifier.imported.value;
            const directPath = paths.get(importedName);
            if (!directPath) {
              throw importPath.buildCodeFrameError(
                `No direct lucide-react-native export found for ${importedName}.`
              );
            }

            replacements.push(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(specifier.local.name))],
                t.stringLiteral(directPath)
              )
            );
          } else if (
            t.isImportSpecifier(specifier) &&
            specifier.importKind === 'type'
          ) {
            typeSpecifiers.push(specifier);
          } else {
            throw importPath.buildCodeFrameError(
              'Only named lucide-react-native imports can be optimized.'
            );
          }
        }

        if (typeSpecifiers.length > 0) {
          const typeDeclaration = t.importDeclaration(
            typeSpecifiers,
            t.stringLiteral('lucide-react-native')
          );
          typeDeclaration.importKind = 'type';
          replacements.unshift(typeDeclaration);
        }

        importPath.replaceWithMultiple(replacements);
      },
    },
  };
};
