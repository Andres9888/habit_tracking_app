import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  'website',
  '__tests__',
  '.test.',
  '__mocks__',
  'jest.setup',
  'jest.config',
  '.detoxrc',
  'tailwind.config',
  'vite.config',
  'eslint.config',
  'test-habit-strength',
];

function shouldIgnore(filePath) {
  return IGNORED_PATTERNS.some(pattern => filePath.includes(pattern));
}

function extractExports(content, filePath) {
  const exports = [];
  
  // Match export statement patterns
  const exportPatterns = [
    // export function
    /export\s+(async\s+)?function\s+(\w+)/g,
    // export const (with arrow function)
    /export\s+const\s+(\w+)\s*=\s*(async\s*)?\(/g,
    // export type/interface
    /export\s+(type|interface)\s+(\w+)/g,
    // export class
    /export\s+class\s+(\w+)/g,
  ];

  for (const pattern of exportPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const name = match[2] || match[1];
      const startPos = match.index;
      
      // Check if there's JSDoc before this export
      const beforeExport = content.slice(Math.max(0, startPos - 300), startPos);
      const hasJSDoc = beforeExport.includes('/**') && beforeExport.includes('*/');
      
      exports.push({ name, hasJSDoc, filePath });
    }
  }
  
  return exports;
}

function auditFile(filePath) {
  if (shouldIgnore(filePath)) return [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return extractExports(content, filePath);
  } catch (e) {
    return [];
  }
}

function getSourceFiles() {
  const files = [];
  
  function walk(dir) {
    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      
      if (shouldIgnore(fullPath)) continue;
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (/\.(ts|tsx|js|jsx)$/.test(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(__dirname);
  return files;
}

console.log('Auditing JSDoc coverage...\n');

const allExports = [];
const files = getSourceFiles();

for (const file of files) {
  const exports = auditFile(file);
  allExports.push(...exports);
}

// Filter to only missing JSDoc
const missing = allExports.filter(e => !e.hasJSDoc);

// Sort by file path
missing.sort((a, b) => a.filePath.localeCompare(b.filePath));

console.log(`Total exports found: ${allExports.length}`);
console.log(`Missing JSDoc: ${missing.length}`);
console.log(`Coverage: ${((allExports.length - missing.length) / allExports.length * 100).toFixed(1)}%\n`);

console.log('Top 20 missing JSDoc:\n');
missing.slice(0, 20).forEach((item, idx) => {
  console.log(`${idx + 1}. ${item.name}`);
  console.log(`   File: ${item.filePath.replace(__dirname + '/', '')}`);
  console.log('');
});

// Output full list for processing
if (missing.length > 0) {
  fs.writeFileSync('missing_jsdoc.json', JSON.stringify(missing.slice(0, 20), null, 2));
}
