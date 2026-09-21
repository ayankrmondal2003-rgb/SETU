"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sourceDir = 'c:/Users/ayank/Downloads/download/SETU-1/images';
const files = fs_1.default.readdirSync(sourceDir);
console.log(`Total files in ${sourceDir}: ${files.length}`);
const grouped = {};
files.forEach(file => {
    const ext = path_1.default.extname(file);
    const nameWithoutExt = path_1.default.basename(file, ext);
    // Group by base name before (number)
    const match = nameWithoutExt.match(/^(.+?)(?:\s*\(([0-9]+)\))?$/);
    if (match) {
        const baseName = match[1].trim();
        if (!grouped[baseName])
            grouped[baseName] = [];
        grouped[baseName].push(file);
    }
});
console.log('\n=== GROUPED IMAGE ASSETS ===');
Object.keys(grouped).forEach(key => {
    console.log(`Key: "${key}" (${grouped[key].length} files) -> ${grouped[key].join(', ')}`);
});
