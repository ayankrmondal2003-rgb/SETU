"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        include: {
            vendor: {
                include: {
                    offerings: {
                        select: { title: true, price: true }
                    }
                }
            }
        },
        orderBy: { role: 'asc' }
    });
    const tourists = users.filter(u => u.role === 'TOURIST');
    const vendors = users.filter(u => u.role === 'VENDOR');
    const admins = users.filter(u => u.role === 'ADMIN');
    console.log('=== TOURISTS ===');
    tourists.forEach((t, i) => {
        console.log(`${i + 1}. ${t.name} | ${t.email} | Phone: ${t.phone || 'N/A'} | Premium: ${t.isPremium ? 'YES (SETU Plus)' : 'NO'}`);
    });
    console.log('\n=== VENDORS ===');
    vendors.forEach((v, i) => {
        console.log(`${i + 1}. ${v.vendor?.businessName || v.name} | User Email: ${v.email} | City: ${v.vendor?.city}, ${v.vendor?.district} | Phone: ${v.phone || v.vendor?.phone} | Status: ${v.vendor?.status} | Offerings: ${v.vendor?.offerings?.length || 0}`);
    });
    await prisma.$disconnect();
}
main().catch(console.error);
