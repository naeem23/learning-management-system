const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: 'Next.js' },
                { name: 'React.js' },
                { name: 'MySQL' },
                { name: 'MongoDB' },
                { name: 'Prisma' },
                { name: 'Tailwind' },
                { name: 'Node.js' },
            ],
        });
        console.log('success');
    } catch (error) {
        console.log('Error seeding categories data.', error);
    } finally {
        database.$disconnect();
    }
}

main();
