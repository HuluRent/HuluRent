const { prisma } = require('../src/config/database');
const bcrypt = require('bcrypt');

async function main() {
  console.log('Starting seed...');

  // 1. Create Categories
  console.log('Seeding categories...');
  
  const categoryNames = [
    'Electronics',
    'Cameras',
    'Tools',
    'Camping',
    'Event Gear',
    'Furniture'
  ];

  const categories = {};
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    categories[slug] = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

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

  // 3. Create Sample Listings (2 per category with standardized 4:3 image proportions)
  console.log('Seeding sample items...');
  const sampleItemsData = [
    {
      cat: 'electronics',
      items: [
        {
          name: 'Epson 1080p Home & Outdoor Projector',
          desc: 'Bright 3,000-lumen portable projector. Includes 100-inch pull-up screen and HDMI cable for movie nights or presentations.',
          price: 450,
          img1: 'https://images.unsplash.com/photo-1594125675255-44580a4f738a?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1768502171609-a51a20ea027a?auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          name: 'EcoFlow Delta 2 Portable Power Station',
          desc: '1024Wh portable battery generator. Ideal for outdoor shoots, film sets, or off-grid events.',
          price: 600,
          img1: 'https://images.unsplash.com/photo-1650785652040-5a2fc88ce902?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1678775882496-59554c53e32e?auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    },
    {
      cat: 'cameras',
      items: [
        {
          name: 'Sony FX3 Cinema Camera Kit',
          desc: 'Full-frame production cinema camera. Package includes XLR handle unit, cage, and two high-speed V60 SD cards.',
          price: 1800,
          img1: 'https://images.unsplash.com/photo-1619099619226-f96e319e3732?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1431068799455-80bae0caf685?auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          name: 'DJI Ronin RS 3 Pro Gimbal Stabilizer',
          desc: '3-axis motorized gimbal for heavy cinema cameras. Includes follow focus motor, briefcase handle, and case.',
          price: 700,
          img1: 'https://images.unsplash.com/photo-1643917367643-d546f2c00f81?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1701120284936-85a539dfc42e?auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    },
    {
      cat: 'tools',
      items: [  
        {
          name: 'Bosch SDS-Max Demolition Hammer',
          desc: 'Heavy-duty concrete breaker hammer. Comes with pointed chisel, flat chisel, and protective carrying case.',
          price: 350,
          img1: 'https://images.unsplash.com/photo-1665631153909-ae7a1b6c137f?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://plus.unsplash.com/premium_photo-1682086494571-65cc866fad9a?auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          name: 'Kärcher Commercial Pressure Washer',
          desc: '3000 PSI high-pressure surface cleaner with 50ft hose and surface scrubber attachment.',
          price: 400,
          img1: 'https://images.unsplash.com/photo-1718152423221-0c72ba1a2ee4?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1594611434234-a032ccdea215?auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    },
    {
      cat: 'camping',
      items: [
        {
          name: 'MSR Hubba Hubba 3-Person Backpacking Tent',
          desc: 'Ultra-lightweight 3-season waterproof tent. Includes footprint tarp and aluminum stakes.',
          price: 250,
          img1: 'https://images.unsplash.com/photo-1624923686627-514dd5e57bae?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1499803270242-467f7311582d?auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          name: 'Yeti Tundra 65 Hard Cooler',
          desc: 'Rotomolded bear-proof cooler with multi-day ice retention. Dry goods basket included.',
          price: 200,
          img1: 'https://images.unsplash.com/photo-1604353624377-8f8f7d9a5dde?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1623114112837-8e64e4a69740?auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    },
    {
      cat: 'event-gear',
      items: [
        {
          name: 'JBL EON ONE MK2 Column PA System',
          desc: 'Battery-powered all-in-one column PA with 5-channel digital mixer, Bluetooth, and wireless mic.',
          price: 1200,
          img1: 'https://images.unsplash.com/photo-1687772424449-005a90a99696?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1687772424499-21363b114191?auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          name: 'Heavy Duty 10x20ft Commercial Canopy Tent',
          desc: 'Waterproof white event pop-up canopy with sidewalls, ground stakes, and 4 sandbag weights.',
          price: 800,
          img1: 'https://images.unsplash.com/photo-1675376616537-c8aa9ddc9977?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1635095248193-0c3669e08d4e?auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    },
    {
      cat: 'furniture',
      items: [
        {
          name: 'White Chiavari Event Chairs (Set of 20)',
          desc: 'Classic resin Chiavari banquet chairs with soft white cushions. Stackable for easy transport.',
          price: 600,
          img1: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          name: '6ft Heavy-Duty Foldable Banquet Tables (Set of 4)',
          desc: 'Commercial-grade plastic folding tables. Seats 6 to 8 people per table. Easy fold-and-carry design.',
          price: 400,
          img1: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&h=600&q=80',
          img2: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    }
  ];

  for (const categoryData of sampleItemsData) {
    const categoryId = categories[categoryData.cat]?.id;
    if (!categoryId) continue;

    for (let i = 0; i < categoryData.items.length; i++) {
      const itemData = categoryData.items[i];
      // Deterministic unique UUID for upsert based on category and index
      const idPrefix = categoryData.cat.substring(0, 8).padEnd(8, '0').replace(/-/g, '0');
      const idStr = `${idPrefix}-0000-0000-0000-00000000000${i}`;

      await prisma.item.upsert({
        where: { id: idStr },
        update: {},
        create: {
          id: idStr,
          ownerId: testUser.id,
          categoryId: categoryId,
          name: itemData.name,
          description: itemData.desc,
          pricePerUnit: itemData.price,
          pricingUnit: 'day',
          depositAmount: itemData.price * 3,
          latitude: 9.0054 + (i * 0.01),
          longitude: 38.7636 + (i * 0.01),
          approxLocation: 'Bole',
          status: 'PUBLISHED',
          images: {
            create: [
              { url: itemData.img1, position: 0 },
              { url: itemData.img2, position: 1 }
            ]
          }
        }
      });
    }
  }

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