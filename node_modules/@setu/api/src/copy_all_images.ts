import fs from 'fs';
import path from 'path';

const sourceDir = 'c:/Users/ayank/Downloads/download/SETU-1/images';
const destDir = 'c:/Users/ayank/Downloads/download/SETU-1/apps/web/public/images';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);
let copied = 0;

files.forEach(file => {
  const srcFile = path.join(sourceDir, file);
  const dstFile = path.join(destDir, file);
  
  if (fs.statSync(srcFile).isFile()) {
    fs.copyFileSync(srcFile, dstFile);
    copied++;
  }
});

console.log(`Successfully copied ${copied} images from ${sourceDir} to ${destDir}`);
