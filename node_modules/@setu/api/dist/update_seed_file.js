"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const seedPath = 'c:/Users/ayank/Downloads/download/SETU-1/apps/api/prisma/seed.ts';
let seedContent = fs_1.default.readFileSync(seedPath, 'utf8');
// Replace any generic placeholder images or older filenames with newly matched ones
seedContent = seedContent
    .replace(/'\/images\/Buddhist Circuit\(2\)\.jpg'/g, "'/images/Buddhist Circuit(2).jpg'")
    .replace(/heroImage: 'https:\/\/images\.unsplash\.com\/photo-1564507592333-c60657eea523\?auto=format&fit=crop&w=1600&q=80'/g, "heroImage: '/images/nalanda (2).jpeg'")
    .replace(/'https:\/\/images\.unsplash\.com\/photo-1564507592333-c60657eea523\?auto=format&fit=crop&w=1200&q=80'/g, "'/images/nalanda (1).jpeg'")
    .replace(/'https:\/\/images\.unsplash\.com\/photo-1600585154340-be6161a56a0c\?auto=format&fit=crop&w=1200&q=80'/g, "'/images/nalanda (3).jpeg'");
fs_1.default.writeFileSync(seedPath, seedContent, 'utf8');
console.log('Updated prisma/seed.ts with local relative image paths!');
