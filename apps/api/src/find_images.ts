import fs from 'fs';
import path from 'path';

function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.gemini') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
        fileList.push({ name: file, path: filePath });
      }
    }
  }
  return fileList;
}

const rootDir = 'c:\\Users\\ayank\\Downloads\\download\\SETU-1';
const images = findImages(rootDir);
console.log(`Found ${images.length} total image files in project:`);
images.forEach(img => console.log(` - ${img.name} (${img.path})`));
