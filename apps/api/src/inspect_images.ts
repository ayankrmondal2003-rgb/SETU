import fs from 'fs';
import path from 'path';

const sourceDir = 'c:/Users/ayank/Downloads/download/SETU-1/images';

const files = fs.readdirSync(sourceDir);
console.log(`Total files in ${sourceDir}: ${files.length}`);

const grouped: Record<string, string[]> = {};

files.forEach(file => {
  const ext = path.extname(file);
  const nameWithoutExt = path.basename(file, ext);
  
  // Group by base name before (number)
  const match = nameWithoutExt.match(/^(.+?)(?:\s*\(([0-9]+)\))?$/);
  if (match) {
    const baseName = match[1].trim();
    if (!grouped[baseName]) grouped[baseName] = [];
    grouped[baseName].push(file);
  }
});

console.log('\n=== GROUPED IMAGE ASSETS ===');
Object.keys(grouped).forEach(key => {
  console.log(`Key: "${key}" (${grouped[key].length} files) -> ${grouped[key].join(', ')}`);
});
