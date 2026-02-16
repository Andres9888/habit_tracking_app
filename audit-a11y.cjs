#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const issues = [];

function findFiles(dir, ext = '.tsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(findFiles(filePath, ext));
      }
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  });
  
  return results;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check 1: Pressable/TouchableOpacity without accessibilityRole
    if ((line.includes('<Pressable') || line.includes('<TouchableOpacity')) && 
        !line.includes('accessibilityRole')) {
      // Check if accessibilityRole appears in the next few lines
      const nextLines = lines.slice(index, index + 10).join('\n');
      if (!nextLines.includes('accessibilityRole')) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'missing-role',
          message: 'Pressable/TouchableOpacity missing accessibilityRole'
        });
      }
    }
    
    // Check 2: Pressable/TouchableOpacity without accessibilityLabel
    if ((line.includes('<Pressable') || line.includes('<TouchableOpacity')) && 
        !line.includes('accessibilityLabel')) {
      const nextLines = lines.slice(index, index + 10).join('\n');
      if (!nextLines.includes('accessibilityLabel') && !nextLines.includes('aria-label')) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'missing-label',
          message: 'Pressable/TouchableOpacity missing accessibilityLabel'
        });
      }
    }
    
    // Check 3: Image without accessibilityLabel
    if (line.includes('<Image') && !line.includes('accessibilityLabel')) {
      const nextLines = lines.slice(index, index + 10).join('\n');
      if (!nextLines.includes('accessibilityLabel') && !nextLines.includes('alt=')) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'image-no-alt',
          message: 'Image missing accessibilityLabel (alt text)'
        });
      }
    }
    
    // Check 4: TextInput without accessibilityLabel
    if (line.includes('<TextInput') && !line.includes('accessibilityLabel')) {
      const nextLines = lines.slice(index, index + 10).join('\n');
      if (!nextLines.includes('accessibilityLabel') && !nextLines.includes('placeholder')) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'input-no-label',
          message: 'TextInput missing accessibilityLabel'
        });
      }
    }
    
    // Check 5: Modal without accessibilityViewIsModal
    if (line.includes('<Modal') && !line.includes('accessibilityViewIsModal')) {
      const nextLines = lines.slice(index, index + 10).join('\n');
      if (!nextLines.includes('accessibilityViewIsModal')) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'modal-no-a11y',
          message: 'Modal missing accessibilityViewIsModal={true}'
        });
      }
    }
    
    // Check 6: Low opacity text (potential contrast issue)
    if (line.match(/opacity[:\s]*0\.[0-5]\d*/) && (line.includes('Text') || line.includes('color'))) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: 'low-contrast',
        message: 'Text with opacity < 0.6 may have contrast issues'
      });
    }
  });
}

// Audit all files
const files = findFiles('./src');
console.log(`Auditing ${files.length} files...`);

files.forEach(file => {
  try {
    auditFile(file);
  } catch (err) {
    console.error(`Error auditing ${file}:`, err.message);
  }
});

// Group and summarize issues
const grouped = {};
issues.forEach(issue => {
  if (!grouped[issue.type]) {
    grouped[issue.type] = [];
  }
  grouped[issue.type].push(issue);
});

console.log('\n=== ACCESSIBILITY AUDIT REPORT ===\n');

Object.keys(grouped).forEach(type => {
  console.log(`${type}: ${grouped[type].length} issues`);
});

console.log(`\nTotal issues: ${issues.length}`);

// Write detailed report
fs.writeFileSync('./a11y-report.json', JSON.stringify(issues, null, 2));
console.log('\nDetailed report written to a11y-report.json');

// Show top 20 issues
console.log('\n=== SAMPLE ISSUES (first 20) ===\n');
issues.slice(0, 20).forEach(issue => {
  console.log(`${issue.file}:${issue.line}`);
  console.log(`  ${issue.type}: ${issue.message}\n`);
});
