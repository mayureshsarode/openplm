import { PrismaClient } from '@prisma/client';
import { seedRolesAndUsers } from './seed/seed-roles-users.js';
import { seedProduct } from './seed/seed-product.js';
import { seedComponents } from './seed/seed-components.js';
import { seedBom } from './seed/seed-bom.js';
import { seedRequirements } from './seed/seed-requirements.js';
import { seedDependencies } from './seed/seed-dependencies.js';

const prisma = new PrismaClient();

export async function runSeed(client: PrismaClient = prisma) {
  console.log('====================================================');
  console.log('OpenPLM — Seeding Development Database (SAC-001)');
  console.log('====================================================');

  const ctx = { prisma: client };

  await seedRolesAndUsers(ctx);
  await seedProduct(ctx);
  await seedComponents(ctx);
  await seedBom(ctx);
  await seedRequirements(ctx);
  await seedDependencies(ctx);

  console.log('====================================================');
  console.log('Development seed complete and verified!');
  console.log('====================================================');
}

async function main() {
  try {
    await runSeed(prisma);
  } catch (error) {
    console.error('Seed execution failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute main when run directly
if (process.argv[1]?.endsWith('seed.ts')) {
  main();
}
