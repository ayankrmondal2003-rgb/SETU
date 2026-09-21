import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isPremium: true
    },
    orderBy: { role: 'asc' }
  });

  const vendors = await prisma.vendor.findMany({
    include: {
      user: {
        select: { email: true, name: true }
      },
      offerings: {
        select: { id: true, title: true, price: true, category: true }
      }
    }
  });

  console.log('=== USERS & ACCOUNTS IN DATABASE ===');
  console.log(JSON.stringify(users, null, 2));

  console.log('\n=== VENDORS & BUSINESS PROFILES IN DATABASE ===');
  console.log(JSON.stringify(vendors, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
