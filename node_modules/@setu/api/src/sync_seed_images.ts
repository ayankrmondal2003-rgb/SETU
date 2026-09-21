import fs from 'fs';
import path from 'path';

const imagesDir = 'c:/Users/ayank/Downloads/download/SETU-1/apps/web/public/images';
const seedFile = 'c:/Users/ayank/Downloads/download/SETU-1/apps/api/prisma/seed.ts';

const availableFiles = fs.readdirSync(imagesDir);

// Build map of baseName -> sorted list of file entries: [{ num: number, filename: string }]
const imageCatalog: Record<string, { num: number, filename: string }[]> = {};

availableFiles.forEach(filename => {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);

  // Match e.g. "Saraswati Puja(1)" or "gaya district (2)" or "Nalanda(1)" or "Nalanda"
  const match = nameWithoutExt.match(/^(.+?)(?:\s*\((\d+)\))?$/);
  if (match) {
    const rawBase = match[1].trim();
    const num = match[2] ? parseInt(match[2], 10) : 1;
    const cleanBase = rawBase.toLowerCase();

    if (!imageCatalog[cleanBase]) {
      imageCatalog[cleanBase] = [];
    }
    imageCatalog[cleanBase].push({ num, filename });
  }
});

// Sort each base's files by number ascending
Object.keys(imageCatalog).forEach(base => {
  imageCatalog[base].sort((a, b) => a.num - b.num);
});

console.log('Available catalog keys:', Object.keys(imageCatalog));

// Utility to resolve images for a given entity name
function resolveEntityImages(entityName: string) {
  const clean = entityName.toLowerCase();
  
  // Try exact match or fuzzy match
  let key = Object.keys(imageCatalog).find(k => k === clean);
  
  if (!key) {
    // Try substring matching
    key = Object.keys(imageCatalog).find(k => clean.includes(k) || k.includes(clean));
  }

  if (!key) return null;

  const entries = imageCatalog[key];
  const img1 = entries.find(e => e.num === 1) || entries[0];
  const img2 = entries.find(e => e.num === 2) || entries[1] || img1;
  const galleryEntries = entries.filter(e => e.num >= 3);

  // If no >=3 gallery entries, fallback to all entries
  const galleryList = galleryEntries.length > 0 
    ? galleryEntries.map(e => `/images/${e.filename}`)
    : entries.map(e => `/images/${e.filename}`);

  return {
    img1: `/images/${img1.filename}`,
    img2: `/images/${img2.filename}`,
    gallery: galleryList
  };
}

// Test resolution on user requested topics
const topics = [
  'Nalanda', 'Madhubani', 'Bodh Gaya', 'Mahabali', 'Jamui', 'Jain temple Jamui',
  'Kucheshwar mahadev', 'Independence day', 'Raksha bandhan', 'Kucheshwar Mahadev Mahotsav',
  'Sufi Mahotsav Maner Sharif', 'Mahashivratri', 'Vikramshila Mahotsav', 'Swaraswati puja',
  'Maa Vishahara Mahotsav', 'Holi', 'Umgeshwari Mahotsav', 'Rohtas Garh Kila Mahotsav',
  'Martand Mahotsav', 'Buddha Mahotsav', 'Prakash Parv', 'Thave Mahotsav',
  'Lachuar & Kundalpur Mahotsav', 'Sitakund Mahotsav', 'Bihar Diwas', 'Koshi Mahotsav',
  'Mithila Mahotsav', 'Guptadham Mahotsav'
];

console.log('\n=== ENTITY IMAGE RESOLUTION TEST ===');
topics.forEach(t => {
  const res = resolveEntityImages(t);
  if (res) {
    console.log(`[✓] "${t}" -> img1: ${res.img1}, img2: ${res.img2}, gallery count: ${res.gallery.length}`);
  } else {
    console.log(`[X] "${t}" -> NO MATCH FOUND`);
  }
});
