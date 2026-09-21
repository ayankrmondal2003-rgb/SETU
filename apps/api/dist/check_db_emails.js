"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
