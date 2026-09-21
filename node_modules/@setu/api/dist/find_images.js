"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findImages(dir, fileList = []) {
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.gemini')
            continue;
        const filePath = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(filePath);
        if (stat.isDirectory()) {
            findImages(filePath, fileList);
        }
        else {
            const ext = path_1.default.extname(file).toLowerCase();
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
