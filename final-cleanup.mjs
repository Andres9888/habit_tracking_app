import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let totalRemoved = 0;
const modified = [];

function removeUnusedStateVariables(filePath, content) {
  let updated = content;
  let removed = 0;

  // Find unused setState callbacks (setX declared but never called)
  const stateMatches = [...content.matchAll(/const\s+\[(\w+),\s*(\w+)\]\s*=\s*useState/g)];
  
  stateMatches.forEach(match => {
    const setState = match[2];
    // Count actual usage (excluding the destructuring line)
    const lines = content.split('\n');
    const declaringLine = content.substring(0, match.index).split('\n').length - 1;
    const usage = lines.filter((l, i) => i !== declaringLine && new RegExp(`\\b${setState}\\b`).test(l)).length;
    
    if (usage === 0) {
      // Comment out the unused setState
      const oldPattern = new RegExp(`const\\s+\\[(\\w+),\\s*${setState}\\]\\s*=`, 'g');
      updated = updated.replace(oldPattern, (m) => {
        const stateVar = m.match(/\((\w+)/)?.[1] || 'state';
        return `const [${stateVar}] =`;
      });
      removed++;
    }
  });

  return { updated, removed };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('useState')) {
      return { removed: 0 };
    }

    const result = removeUnusedStateVariables(filePath, content);
    if (result.removed > 0 && result.updated !== content) {
      fs.writeFileSync(filePath, result.updated);
      modified.push(filePath.replace(__dirname, ''));
      totalRemoved += result.removed;
      return { removed: result.removed };
    }
    return { removed: 0 };
  } catch (e) {
    return { removed: 0, error: e.message };
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '__mocks__', '.git', 'dist', 'build', '.next'].includes(file)) {
        walkDir(filePath);
      }
    } else if ((/\.tsx?$/.test(file) || /\.jsx?$/.test(file)) && !file.includes('.d.ts') && !file.includes('.test')) {
      processFile(filePath);
    }
  });
}

console.log('🧹 Removing unused setState variables...\n');
walkDir(path.join(__dirname, 'src'));

console.log(`✅ Cleanup complete!\n`);
console.log(`🗑️  Total unused variables removed: ${totalRemoved}`);
console.log(`📝 Files modified: ${modified.length}\n`);

if (modified.length > 0) {
  console.log('Modified files:');
  modified.slice(0, 20).forEach(f => console.log(`  ${f}`));
}
