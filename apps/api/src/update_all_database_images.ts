import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const imagesDir = 'c:/Users/ayank/Downloads/download/SETU-1/apps/web/public/images';

const availableFiles = fs.readdirSync(imagesDir);

// Map of normalized key -> array of { num: number, filename: string }
const catalog: Record<string, { num: number; filename: string }[]> = {};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/mahotsab/g, 'mahotsav')
    .replace(/swaraswati/g, 'saraswati')
    .replace(/mahashivratri/g, 'maha shivaratri')
    .replace(/thavo/g, 'thave')
    .replace(/[^a-z0-9]/g, '');
}

availableFiles.forEach(filename => {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);

  const match = nameWithoutExt.match(/^(.+?)(?:\s*\((\d+)\))?$/);
  if (match) {
    const rawBase = match[1].trim();
    const num = match[2] ? parseInt(match[2], 10) : 1;
    const normKey = normalize(rawBase);

    if (!catalog[normKey]) catalog[normKey] = [];
    catalog[normKey].push({ num, filename });
  }
});

// Sort ascending by number
Object.keys(catalog).forEach(k => {
  catalog[k].sort((a, b) => a.num - b.num);
});

function getAssetSet(name: string) {
  const norm = normalize(name);
  
  // Find best catalog key
  let matchKey = Object.keys(catalog).find(k => k === norm);
  if (!matchKey) {
    matchKey = Object.keys(catalog).find(k => norm.includes(k) || k.includes(norm));
  }

  if (!matchKey) return null;

  const entries = catalog[matchKey];
  const img1 = entries.find(e => e.num === 1) || entries[0];
  const img2 = entries.find(e => e.num === 2) || entries[1] || img1;
  const galleryEntries = entries.filter(e => e.num >= 3);

  const gallery = (galleryEntries.length > 0 ? galleryEntries : entries).map(e => `/images/${e.filename}`);

  return {
    logoOrThumb: `/images/${img1.filename}`,
    heroOrBig: `/images/${img2.filename}`,
    gallery: gallery
  };
}

async function main() {
  console.log('=== UPDATING DATABASE IMAGES FOR USER & VENDOR UI ===\n');

  // 1. Events
  const events = await prisma.event.findMany();
  console.log(`Processing ${events.length} Events...`);
  for (const evt of events) {
    const assets = getAssetSet(evt.title);
    if (assets) {
      await prisma.event.update({
        where: { id: evt.id },
        data: {
          heroImage: assets.heroOrBig,
          gallery: JSON.stringify(assets.gallery)
        }
      });
      console.log(`  ✓ Event [${evt.title}] -> hero: ${assets.heroOrBig}, gallery: ${assets.gallery.length} images`);
    } else {
      console.log(`  - Event [${evt.title}] -> kept existing`);
    }
  }

  // 2. Destinations
  const destinations = await prisma.destination.findMany();
  console.log(`\nProcessing ${destinations.length} Destinations...`);
  for (const dest of destinations) {
    const assets = getAssetSet(dest.name);
    if (assets) {
      await prisma.destination.update({
        where: { id: dest.id },
        data: {
          heroImage: assets.heroOrBig,
          gallery: JSON.stringify(assets.gallery)
        }
      });
      console.log(`  ✓ Destination [${dest.name}] -> hero: ${assets.heroOrBig}, gallery: ${assets.gallery.length} images`);
    } else {
      console.log(`  - Destination [${dest.name}] -> kept existing`);
    }
  }

  // 3. Offerings
  const offerings = await prisma.offering.findMany();
  console.log(`\nProcessing ${offerings.length} Offerings...`);
  for (const off of offerings) {
    const assets = getAssetSet(off.title);
    if (assets) {
      await prisma.offering.update({
        where: { id: off.id },
        data: {
          coverImage: assets.heroOrBig,
          gallery: JSON.stringify(assets.gallery)
        }
      });
      console.log(`  ✓ Offering [${off.title}] -> cover: ${assets.heroOrBig}, gallery: ${assets.gallery.length} images`);
    }
  }

  // 4. Vendors
  const vendors = await prisma.vendor.findMany();
  console.log(`\nProcessing ${vendors.length} Vendors...`);
  for (const v of vendors) {
    const assets = getAssetSet(v.businessName) || getAssetSet(v.city);
    if (assets) {
      await prisma.vendor.update({
        where: { id: v.id },
        data: {
          logo: assets.logoOrThumb,
          coverImage: assets.heroOrBig
        }
      });
      console.log(`  ✓ Vendor [${v.businessName}] -> logo: ${assets.logoOrThumb}, cover: ${assets.heroOrBig}`);
    }
  }

  // 5. City Hubs
  const cityHubs = await prisma.cityHub.findMany();
  console.log(`\nProcessing ${cityHubs.length} City Hubs...`);
  for (const hub of cityHubs) {
    const assets = getAssetSet(hub.name);
    if (assets) {
      await prisma.cityHub.update({
        where: { id: hub.id },
        data: {
          heroImage: assets.heroOrBig
        }
      });
      console.log(`  ✓ City Hub [${hub.name}] -> hero: ${assets.heroOrBig}`);
    }
  }

  console.log('\n✅ Database Image Asset Synchronization Complete!');
  await prisma.$disconnect();
}

main().catch(console.error);
