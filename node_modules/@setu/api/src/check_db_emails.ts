import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      name: true
    }
  });

  console.log('=== REAL DATABASE USER EMAILS ===');
  console.log(users);
  await prisma.$disconnect();
}

main().catch(console.error);
