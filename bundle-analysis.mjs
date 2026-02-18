import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const nodeModulesPath = './node_modules';

// Get all installed dependencies with their sizes
const getDependencies = () => {
  const deps = [];
  const nodeModules = fs.readdirSync(nodeModulesPath);
  
  for (const module of nodeModules) {
    if (module.startsWith('.')) continue;
    
    const modulePath = path.join(nodeModulesPath, module);
    const stat = fs.statSync(modulePath);
    
    if (stat.isDirectory()) {
      try {
        const size = execSync(`du -sb "${modulePath}" 2>/dev/null | awk '{print $1}'`).toString().trim();
        if (size) {
          deps.push({
            name: module,
            size: parseInt(size, 10),
            sizeKB: Math.round(parseInt(size, 10) / 1024),
            sizeMB: (parseInt(size, 10) / 1024 / 1024).toFixed(2)
          });
        }
      } catch (e) {
        // Skip on error
      }
    }
  }
  
  return deps.sort((a, b) => b.size - a.size);
};

const deps = getDependencies();
const top10 = deps.slice(0, 10);

console.log('📦 Top 10 Largest Dependencies\n');
console.log('Rank | Package Name | Size (MB) | Size (KB)');
console.log('-----|--------------|-----------|----------');

let totalSize = 0;
top10.forEach((dep, idx) => {
  totalSize += dep.size;
  const name = dep.name.padEnd(30);
  console.log(`${String(idx + 1).padEnd(4)} | ${name} | ${dep.sizeMB.padStart(8)} MB | ${dep.sizeKB.toString().padStart(8)} KB`);
});

console.log('\n📊 Total Size of Top 10:', (totalSize / 1024 / 1024).toFixed(2), 'MB');
console.log('📊 Total Dependencies:', deps.length);
console.log('📊 Total node_modules Size:', (deps.reduce((a, b) => a + b.size, 0) / 1024 / 1024).toFixed(2), 'MB');

// Check for duplicates
console.log('\n🔍 Top 10 Analysis:');
top10.forEach((dep, idx) => {
  console.log(`${idx + 1}. ${dep.name}: ${dep.sizeMB} MB`);
});

// Export for optimization report
fs.writeFileSync('bundle-analysis.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  top10,
  totalDeps: deps.length,
  totalSize: deps.reduce((a, b) => a + b.size, 0),
  allDeps: deps
}, null, 2));

console.log('\n✅ Analysis saved to bundle-analysis.json');
