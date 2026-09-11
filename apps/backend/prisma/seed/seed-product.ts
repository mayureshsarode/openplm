import { ProductRevisionStatus } from '@prisma/client';
import { SEED_IDS } from './constants.js';
import type { SeedContext } from './types.js';

export async function seedProduct({ prisma }: SeedContext) {
  console.log('Seeding SAC-001 product and revision...');

  const product = await prisma.product.upsert({
    where: { productNumber: 'SAC-001' },
    update: {
      name: 'Smart Access Control System',
      description: 'Integrated access control system with facial authentication',
      createdBy: SEED_IDS.users.engineer,
    },
    create: {
      id: SEED_IDS.products.sac001,
      productNumber: 'SAC-001',
      name: 'Smart Access Control System',
      description: 'Integrated access control system with facial authentication',
      createdBy: SEED_IDS.users.engineer,
    },
  });

  const productRevision = await prisma.productRevision.upsert({
    where: {
      productId_revisionNumber: {
        productId: product.id,
        revisionNumber: 1,
      },
    },
    update: {
      displayCode: 'A',
      status: ProductRevisionStatus.APPROVED,
      description: 'Initial approved baseline for SAC-001 Smart Access Control System',
      createdBy: SEED_IDS.users.engineer,
    },
    create: {
      id: SEED_IDS.products.sac001RevA,
      productId: product.id,
      revisionNumber: 1,
      displayCode: 'A',
      status: ProductRevisionStatus.APPROVED,
      description: 'Initial approved baseline for SAC-001 Smart Access Control System',
      createdBy: SEED_IDS.users.engineer,
    },
  });

  console.log(`✓ Seeded Product ${product.productNumber} and Revision ${productRevision.displayCode}.`);
  return { product, productRevision };
}
