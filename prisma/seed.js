import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data if needed (uncomment if you want to reset the database)
  // await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=0;`;
  // await prisma.$executeRaw`TRUNCATE TABLE Product;`;
  // await prisma.$executeRaw`TRUNCATE TABLE ProductImage;`;
  // await prisma.$executeRaw`TRUNCATE TABLE ProductColor;`;
  // await prisma.$executeRaw`TRUNCATE TABLE ProductSize;`;
  // await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=1;`;

  // Create some products
  const shirt = await prisma.product.create({
    data: {
      name: 'Classic T-Shirt',
      description: 'A comfortable cotton t-shirt',
      material: 'Cotton',
      type: 'shirt',
      gender: 'male',
      price: 100000,
      salePrice: 50000,
      images: {
        create: [
          { url: 'https://placehold.co/250x400/', alt: 'Classic T-Shirt front' },
          { url: 'https://placehold.co/250x400/', alt: 'Classic T-Shirt back' },
          { url: 'https://placehold.co/250x400/', alt: 'Classic T-Shirt side' },
        ],
      },
      colors: {
        create: [
          { name: 'Red', color: 'red-500' },
          { name: 'Green', color: 'green-500' },
        ],
      },
      sizes: {
        create: [
          { value: 'S' },
          { value: 'M' },
          { value: 'L' },
        ],
      },
    },
  });

  const pants = await prisma.product.create({
    data: {
      name: 'Slim-fit Jeans',
      description: 'Modern slim-fit jeans',
      material: 'Denim',
      type: 'pants',
      gender: 'male',
      price: 250000,
      salePrice: null,
      images: {
        create: [
          { url: 'https://placehold.co/250x400/', alt: 'Jeans front' },
          { url: 'https://placehold.co/250x400/', alt: 'Jeans back' },
        ],
      },
      colors: {
        create: [
          { name: 'Blue', color: 'blue-700' },
          { name: 'Dark Gray', color: 'gray-800' },
        ],
      },
      sizes: {
        create: [
          { value: 'M' },
          { value: 'L' },
          { value: 'XL' },
        ],
      },
    },
  });

  // Add some underwear product
  const underwear = await prisma.product.create({
    data: {
      name: 'Comfort Boxers',
      description: 'Comfortable cotton boxers',
      material: 'Cotton',
      type: 'unders',
      gender: 'male',
      price: 80000,
      salePrice: 65000,
      images: {
        create: [
          { url: 'https://placehold.co/250x400/', alt: 'Boxers front' },
          { url: 'https://placehold.co/250x400/', alt: 'Boxers back' },
        ],
      },
      colors: {
        create: [
          { name: 'Black', color: 'black' },
          { name: 'White', color: 'white' },
        ],
      },
      sizes: {
        create: [
          { value: 'M' },
          { value: 'L' },
          { value: 'XL' },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });