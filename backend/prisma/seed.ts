import { PrismaClient, PricingType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing catalog data (safe for dev re-runs)
  await prisma.subService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();

  // Category
  const homeServices = await prisma.serviceCategory.create({
    data: { name: 'Home Services', displayOrder: 1, active: true },
  });

  // 1. Plumber — VISITING (visit fee upfront, quote on-site), no sub-services
  await prisma.service.create({
    data: {
      categoryId: homeServices.id,
      name: 'Plumber',
      slug: 'plumber',
      description: 'Expert plumbers for leaks, fittings, blockages & installations.',
      hasSubServices: false,
      pricingType: PricingType.VISITING,
      visitFee: 14900, // ₹149
      durationMins: 60,
      displayOrder: 1,
    },
  });

  // 2. Electrician — VISITING, no sub-services
  await prisma.service.create({
    data: {
      categoryId: homeServices.id,
      name: 'Electrician',
      slug: 'electrician',
      description: 'Certified electricians for wiring, switches, fans & repairs.',
      hasSubServices: false,
      pricingType: PricingType.VISITING,
      visitFee: 14900, // ₹149
      durationMins: 60,
      displayOrder: 2,
    },
  });

  // 3. Maid — has sub-services (hourly packages)
  const maid = await prisma.service.create({
    data: {
      categoryId: homeServices.id,
      name: 'Maid',
      slug: 'maid',
      description: 'Trusted maids for cleaning, dishes, and daily household help.',
      hasSubServices: true,
      displayOrder: 3,
    },
  });
  await prisma.subService.createMany({
    data: [
      { serviceId: maid.id, name: 'Maid - 2 Hours', description: 'Cleaning & household help for 2 hours.', pricingType: PricingType.HOURLY, hourlyRate: 15000, durationMins: 120, displayOrder: 1 },
      { serviceId: maid.id, name: 'Maid - 4 Hours', description: 'Cleaning & household help for 4 hours.', pricingType: PricingType.HOURLY, hourlyRate: 15000, durationMins: 240, displayOrder: 2 },
    ],
  });

  // 4. Deep Cleaning — has sub-services (fixed-price packages)
  const deepCleaning = await prisma.service.create({
    data: {
      categoryId: homeServices.id,
      name: 'Deep Cleaning',
      slug: 'deep-cleaning',
      description: 'Thorough deep cleaning for homes of every size.',
      hasSubServices: true,
      displayOrder: 4,
    },
  });
  await prisma.subService.createMany({
    data: [
      { serviceId: deepCleaning.id, name: '1 BHK Full Home Deep Cleaning', description: 'Complete deep cleaning for a 1 BHK home.', pricingType: PricingType.FIXED, basePrice: 149900, durationMins: 240, displayOrder: 1 },
      { serviceId: deepCleaning.id, name: '2 BHK Full Home Deep Cleaning', description: 'Complete deep cleaning for a 2 BHK home.', pricingType: PricingType.FIXED, basePrice: 249900, durationMins: 360, displayOrder: 2 },
      { serviceId: deepCleaning.id, name: '3 BHK Full Home Deep Cleaning', description: 'Complete deep cleaning for a 3 BHK home.', pricingType: PricingType.FIXED, basePrice: 349900, durationMins: 480, displayOrder: 3 },
      { serviceId: deepCleaning.id, name: 'Bathroom Deep Cleaning (1 Bathroom)', description: 'Intensive cleaning for one bathroom.', pricingType: PricingType.FIXED, basePrice: 59900, durationMins: 90, displayOrder: 4 },
    ],
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
