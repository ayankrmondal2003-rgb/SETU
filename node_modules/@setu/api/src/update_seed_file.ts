import fs from 'fs';
import path from 'path';

const seedPath = 'c:/Users/ayank/Downloads/download/SETU-1/apps/api/prisma/seed.ts';
let seedContent = fs.readFileSync(seedPath, 'utf8');

// Replace any generic placeholder images or older filenames with newly matched ones
seedContent = seedContent
  .replace(/'\/images\/Buddhist Circuit\(2\)\.jpg'/g, "'/images/Buddhist Circuit(2).jpg'")
  .replace(/heroImage: 'https:\/\/images\.unsplash\.com\/photo-1564507592333-c60657eea523\?auto=format&fit=crop&w=1600&q=80'/g, "heroImage: '/images/nalanda (2).jpeg'")
  .replace(/'https:\/\/images\.unsplash\.com\/photo-1564507592333-c60657eea523\?auto=format&fit=crop&w=1200&q=80'/g, "'/images/nalanda (1).jpeg'")
  .replace(/'https:\/\/images\.unsplash\.com\/photo-1600585154340-be6161a56a0c\?auto=format&fit=crop&w=1200&q=80'/g, "'/images/nalanda (3).jpeg'");

fs.writeFileSync(seedPath, seedContent, 'utf8');
console.log('Updated prisma/seed.ts with local relative image paths!');
