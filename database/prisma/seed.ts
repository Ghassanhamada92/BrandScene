import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@brandscene.ai' },
    update: {},
    create: {
      email: 'demo@brandscene.ai',
      name: 'Demo User',
      passwordHash: '$2b$10$XYZ...', // This should be a real bcrypt hash
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create demo project
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Sample Campaign',
      description: 'A demo project to showcase BrandScene AI capabilities',
      status: 'active',
      currentStage: 1,
    },
  });

  console.log('✅ Created demo project:', project.name);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
