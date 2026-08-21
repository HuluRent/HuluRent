// One-shot script: upserts the 11 categories shown in the HuluRent UI
// Run with: node seed-categories.js  (from the backend/ directory)

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Electronics',         slug: 'electronics',        icon: 'devices' },
  { name: 'Books & Education',   slug: 'books-education',    icon: 'menu_book' },
  { name: 'Musical Instruments', slug: 'musical-instruments',icon: 'music_note' },
  { name: 'Furniture',           slug: 'furniture',          icon: 'chair' },
  { name: 'Fashion',             slug: 'fashion',            icon: 'checkroom' },
  { name: 'Tools & Equipment',   slug: 'tools-equipment',    icon: 'handyman' },
  { name: 'Events & Party',      slug: 'events-party',       icon: 'celebration' },
  { name: 'Sports & Outdoors',   slug: 'sports-outdoors',    icon: 'sports_soccer' },
  { name: 'Baby & Kids',         slug: 'baby-kids',          icon: 'child_care' },
  { name: 'Agriculture',         slug: 'agriculture',        icon: 'agriculture' },
  { name: 'Other',               slug: 'other',              icon: 'category' },
];

async function main() {
  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    console.log(`  ✓ ${result.name} (${result.id})`);
  }
  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
