import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const counts = {
        users: await prisma.user.count(),
        companies: await prisma.company.count(),
        tasks: await prisma.task.count(),
        jobs: await prisma.recruitmentjob.count(),
        courses: await prisma.trainingCourse.count(),
        productUsage: await prisma.productusage.count(),
        auditLogs: await prisma.auditlog.count(),
    };
    console.log(JSON.stringify(counts, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
