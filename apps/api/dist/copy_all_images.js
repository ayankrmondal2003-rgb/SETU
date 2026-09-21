"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sourceDir = 'c:/Users/ayank/Downloads/download/SETU-1/images';
const destDir = 'c:/Users/ayank/Downloads/download/SETU-1/apps/web/public/images';
if (!fs_1.default.existsSync(destDir)) {
    fs_1.default.mkdirSync(destDir, { recursive: true });
}
const files = fs_1.default.readdirSync(sourceDir);
let copied = 0;
files.forEach(file => {
    const srcFile = path_1.default.join(sourceDir, file);
    const dstFile = path_1.default.join(destDir, file);
    if (fs_1.default.statSync(srcFile).isFile()) {
        fs_1.default.copyFileSync(srcFile, dstFile);
        copied++;
    }
});
console.log(`Successfully copied ${copied} images from ${sourceDir} to ${destDir}`);
