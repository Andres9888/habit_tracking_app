const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const results = {
  totalRemoved: 0,
  components: [],
  errors: []
};

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath, callback);
    } else if (/\.(tsx?|jsx?)$/.test(file) && !file.endsWith('.d.ts') && !file.includes('.test.') && !file.includes('.mock.')) {
      callback(filePath);
    }
  });
}

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if not a component
    if (!content.includes('React') && !content.includes('function') && !content.includes('const') && !content.includes('export')) {
      return null;
    }

    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    let removed = 0;
    const issues = [];

    // Check for unused props in function components
    const regex = /function\s+(\w+)\s*\(\s*({[^}]*})\s*\)|const\s+(\w+)\s*=\s*(?:\(({[^}]*})\)|{[^}]*})/g;
    
    // Simple heuristic-based unused detection
    const unusedPropsRegex = /({[^}]*?\b(\w+)\b[^}]*?})/;
    
    // Find destructured props
    const propMatches = content.match(/{[^}]+}\s*(?:=|:)\s*(?:React\.|FC<|FunctionComponent<|props|interface)/g);
    
    if (propMatches) {
      propMatches.forEach(match => {
        const propsInMatch = match.match(/\b([a-z][a-zA-Z0-9]*)\b/g) || [];
        
        propsInMatch.forEach(prop => {
          // Check if prop is actually used in component (simple heuristic)
          const propUsageRegex = new RegExp(`\\b${prop}\\b`, 'g');
          const matches = (content.match(propUsageRegex) || []);
          
          // If only declared once, likely unused
          if (matches.length <= 1) {
            removed++;
            issues.push(`Unused prop: ${prop}`);
          }
        });
      });
    }

    if (removed > 0 || issues.length > 0) {
      return {
        file: filePath.replace('/Users/Andres/habit_tracking_app/', ''),
        removed,
        issues
      };
    }
    
    return null;
  } catch (error) {
    results.errors.push({ file: filePath, error: error.message });
    return null;
  }
}

// Walk through src directory
console.log('Auditing components...');
walkDir(path.join(__dirname, 'src'), (filePath) => {
  const result = analyzeFile(filePath);
  if (result) {
    results.components.push(result);
    results.totalRemoved += result.removed;
  }
});

console.log('\n=== AUDIT RESULTS ===');
console.log(`Total unused items found: ${results.totalRemoved}`);
console.log(`Components with unused code: ${results.components.length}\n`);

results.components.slice(0, 20).forEach(comp => {
  console.log(`${comp.file}: ${comp.removed} unused`);
  comp.issues.forEach(issue => console.log(`  - ${issue}`));
});

if (results.errors.length > 0) {
  console.log(`\nErrors: ${results.errors.length}`);
}

process.exit(0);
