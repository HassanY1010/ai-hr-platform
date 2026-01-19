import prisma from './apps/api/src/config/db.js';

async function debugPrisma() {
    console.log('Prisma keys:', Object.keys(prisma).filter(k => !k.startsWith('_')));

    try {
        const usageCount = await prisma.productUsage.count();
        console.log('ProductUsage count:', usageCount);
        const usageData = await prisma.productUsage.findMany({ take: 5 });
        console.log('Recent usage data sample:', JSON.stringify(usageData, null, 2));
    } catch (e) {
        console.log('Error accessing productUsage:', e.message);
    }

    try {
        const usageCount2 = await prisma.productusage.count();
        console.log('productusage count:', usageCount2);
    } catch (e) {
        console.log('Error accessing productusage:', e.message);
    }
}

debugPrisma().then(() => process.exit(0));
