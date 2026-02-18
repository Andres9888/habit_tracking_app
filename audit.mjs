import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const results = {
  removed: 0,
  files: [],
  changes: []
};

function scanComponent(filePath, content) {
  let modifications = [];
  let initialLength = (content.match(/\b[a-zA-Z_$]\w*/g) || []).length;

  // Pattern 1: Unused destructured props  
  // Find function params with destructured props that aren't used
  const destructurePattern = /const\s+{\s*([^}]+)\s*}\s*=\s*(?:props|React|route|navigation)/g;
  
  content.replace(destructurePattern, (match, props) => {
    const propList = props.split(',').map(p => p.trim());
    propList.forEach(prop => {
      const propName = prop.split(/[=:]/)[0].trim();
      if (propName && !propName.includes('...')) {
        const usageCount = (content.match(new RegExp(`\\b${propName}\\b`, 'g')) || []).length;
        if (usageCount === 1) { // Only mentioned in destructuring
          modifications.push(propName);
        }
      }
    });
  });

  // Pattern 2: Unused useState variables
  const statePattern = /const\s+\[\s*(\w+)\s*(?:,\s*\w+)?\s*\]\s*=\s*useState/g;
  content.replace(statePattern, (match, varName) => {
    const usageCount = (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
    if (usageCount === 1) {
      modifications.push(varName);
    }
  });

  // Pattern 3: Unused function params
  const funcPattern = /function\s+\w+\s*\(\s*{([^}]+)}\s*\)/;
  const funcMatch = content.match(funcPattern);
  if (funcMatch) {
    const params = funcMatch[1].split(',');
    params.forEach(param => {
      const paramName = param.split(/[=:]/)[0].trim();
      if (paramName && !paramName.includes('...')) {
        const usageCount = (content.match(new RegExp(`\\b${paramName}\\b`, 'g')) || []).length;
        if (usageCount === 1) {
          modifications.push(paramName);
        }
      }
    });
  }

  if (modifications.length > 0) {
    return {
      file: filePath.replace(__dirname, '').substring(1),
      removed: modifications.length,
      items: modifications
    };
  }
  return null;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '__mocks__') {
      walkDir(filePath);
    } else if ((/\.tsx?$/.test(file) || /\.jsx?$/.test(file)) && 
               !file.endsWith('.d.ts') && 
               !file.includes('.test.') && 
               !file.includes('.spec.')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('export') || content.includes('function') || content.includes('const')) {
          const result = scanComponent(filePath, content);
          if (result && result.removed > 0) {
            results.files.push(result);
            results.removed += result.removed;
            results.changes.push(result);
          }
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }
  });
}

console.log('🔍 Scanning for unused state/props...\n');
walkDir(path.join(__dirname, 'src'));

console.log(`✅ AUDIT COMPLETE\n`);
console.log(`Total unused items found: ${results.removed}`);
console.log(`Components affected: ${results.files.length}\n`);

if (results.files.length > 0) {
  console.log('Top components with unused code:');
  results.files.slice(0, 15).forEach(f => {
    console.log(`  ${f.file.substring(0, 60)}: ${f.removed} unused`);
  });
}

if (results.removed > 0) {
  console.log(`\n📊 Summary: Found ${results.removed} unused declarations across ${results.files.length} files`);
}
