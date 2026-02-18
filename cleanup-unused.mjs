import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditData = JSON.parse(fs.readFileSync('.audit-results.json', 'utf8'));

let totalRemoved = 0;
const changedFiles = [];

function cleanupFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  let removed = 0;

  // Remove unused const declarations (keeping those that are conditionally used)
  content = content.replace(/\n\s*const\s+(\w+)\s*=\s*(?:useState|useCallback|useMemo)\([^)]*\)(?=\s*[;,\n])/g, (match, varName) => {
    const pattern = new RegExp(`\\b${varName}\\b`, 'g');
    const count = (original.match(pattern) || []).length;
    if (count === 1) {
      removed++;
      return '';
    }
    return match;
  });

  // Clean up empty destructuring
  content = content.replace(/const\s+{\s*}\s*=\s*[^;]+;/g, '');

  // Remove unused imports
  content = content.replace(/import\s+(?:{[^}]*}|[^;]+)\s+from\s+['"][^'"]+['"];?/gm, (match) => {
    const imports = match.match(/\w+/g) || [];
    const filtered = imports.filter(imp => {
      return content.includes(imp) || ['React', 'useState', 'useEffect', 'memo'].includes(imp);
    });
    if (filtered.length === 0 && !match.includes('side-effects')) {
      removed++;
      return '';
    }
    return match;
  });

  // Clean excessive whitespace
  content = content.replace(/\n\n\n+/g, '\n\n');

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    changedFiles.push(filePath.replace(__dirname, ''));
    totalRemoved++;
  }
}

console.log(`🧹 Starting cleanup of ${auditData.files.length} files...\n`);

auditData.files.slice(0, 100).forEach(file => {
  const fullPath = path.join(__dirname, file.file);
  if (fs.existsSync(fullPath)) {
    cleanupFile(fullPath);
  }
});

console.log(`✅ Cleanup complete!\n`);
console.log(`📝 Files modified: ${changedFiles.length}`);
console.log(`🗑️  Total cleanup operations: ${totalRemoved}\n`);
console.log(`📊 Files changed:`);
changedFiles.slice(0, 15).forEach(f => console.log(`  ${f}`));

