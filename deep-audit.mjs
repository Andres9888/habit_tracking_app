import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const results = { total: 0, files: [] };

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // 1. Check for unused useState declarations
  const stateMatches = [...content.matchAll(/const\s+\[(\w+)(?:\s*,\s*\w+)?\]\s*=\s*useState/g)];
  stateMatches.forEach(match => {
    const varName = match[1];
    const count = (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
    if (count <= 1) {
      issues.push({ type: 'unused_state', name: varName });
    }
  });

  // 2. Check for unused props in destructuring
  const destructMatches = [...content.matchAll(/(?:function|const)\s+\w+[^{]*\((?:\s*{([^}]+)}|\s*\w+)\)?[^{]*{/g)];
  destructMatches.forEach(match => {
    if (match[1]) {
      const propStr = match[1];
      const props = propStr.split(',').map(p => p.split(/[=:]/)[0].trim()).filter(p => p && !p.includes('...'));
      props.forEach(prop => {
        const count = (content.match(new RegExp(`\\b${prop}\\b`, 'g')) || []).length;
        if (count <= 1 && prop.length > 2) {
          issues.push({ type: 'unused_prop', name: prop });
        }
      });
    }
  });

  // 3. Check for unused useEffect dependencies or unused variables
  const varMatches = [...content.matchAll(/(?:const|let)\s+(\w+)\s*=/g)];
  varMatches.forEach(match => {
    const varName = match[1];
    if (!/^[A-Z]/.test(varName) && varName.length > 3) { // Skip exports and short names
      const count = (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
      if (count <= 2 && !['memo', 'lazy', 'forwardRef'].includes(varName)) {
        issues.push({ type: 'unused_variable', name: varName });
      }
    }
  });

  if (issues.length > 0) {
    return {
      file: filePath.replace(__dirname, '').substring(1),
      count: issues.length,
      issues: issues.slice(0, 5) // Limit to first 5
    };
  }
  return null;
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
    } else if (/\.(tsx?|jsx?)$/.test(file) && !file.includes('.d.ts') && !file.includes('.test') && !file.includes('.spec')) {
      try {
        const result = analyzeFile(filePath);
        if (result) {
          results.files.push(result);
          results.total += result.count;
        }
      } catch (e) {}
    }
  });
}

console.log('🔍 Deep analysis of unused state/props...\n');
walkDir(path.join(__dirname, 'src'));

console.log(`✅ Scan complete!\n`);
console.log(`📊 Total unused items detected: ${results.total}`);
console.log(`📁 Files with issues: ${results.files.length}\n`);

const sorted = results.files.sort((a, b) => b.count - a.count);
sorted.slice(0, 20).forEach(f => {
  console.log(`${f.file.substring(0, 70)}: ${f.count} unused`);
});

if (results.total > 0) {
  console.log(`\n💾 Saved audit data for cleanup...`);
  fs.writeFileSync('.audit-results.json', JSON.stringify(results, null, 2));
}
