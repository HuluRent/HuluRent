const { prisma } = require('../src/config/database');
const bcrypt = require('bcrypt');

async function main() {
  console.log('Starting seed...');

  // 1. Create Categories
  console.log('Seeding categories...');
  const catElectronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
    },
  });

  const catTools = await prisma.category.upsert({
    where: { slug: 'tools' },
    update: {},
    create: {
      name: 'Tools',
      slug: 'tools',
    },
  });


  
  // 2. Create a Test User
  console.log('Seeding test user...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@hulurent.com' },
    update: {},
    create: {
      email: 'test@hulurent.com',
      passwordHash,
      role: 'USER',
      profile: {
        create: {
          displayName: 'Test User',
          city: 'Addis Ababa',
          bio: 'I love renting out my gear!'
        }
      }
    },
  });

  // 3. Create a Sample Listing
  console.log('Seeding sample item...');
  const sampleItem = await prisma.item.upsert({
    // Hardcoding a UUID for the seed item so upsert doesn't duplicate it
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      ownerId: testUser.id,
      categoryId: catElectronics.id,
      name: 'Sony A7III Camera',
      description: 'Professional mirrorless camera for rent. Comes with 28-70mm lens and 2 batteries.',
      pricePerUnit: 1500.00,
      pricingUnit: 'day',
      depositAmount: 5000.00,
      latitude: 9.0054,
      longitude: 38.7636,
      approxLocation: 'Bole',
      status: 'PUBLISHED'
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
