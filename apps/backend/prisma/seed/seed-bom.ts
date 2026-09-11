import { SEED_IDS } from './constants.js';
import type { SeedContext } from './types.js';

export async function seedBom({ prisma }: SeedContext) {
  console.log('Seeding SAC-001 BOM and hierarchical BOM items...');

  const bom = await prisma.bom.upsert({
    where: { productRevisionId: SEED_IDS.products.sac001RevA },
    update: {
      createdBy: SEED_IDS.users.engineer,
    },
    create: {
      id: SEED_IDS.bom.sac001Bom,
      productRevisionId: SEED_IDS.products.sac001RevA,
      createdBy: SEED_IDS.users.engineer,
    },
  });

  // 1. Seed root-level BOM items first
  const rootItems = [
    {
      id: SEED_IDS.bomItems.ctrl001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.ctrl001RevA,
      parentBomItemId: null,
      quantity: 1,
      position: 10,
    },
    {
      id: SEED_IDS.bomItems.cam001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.cam001RevA,
      parentBomItemId: null,
      quantity: 1,
      position: 20,
    },
    {
      id: SEED_IDS.bomItems.ir001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.ir001RevA,
      parentBomItemId: null,
      quantity: 2,
      position: 30,
    },
    {
      id: SEED_IDS.bomItems.lock001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.lock001RevA,
      parentBomItemId: null,
      quantity: 1,
      position: 40,
    },
    {
      id: SEED_IDS.bomItems.pwr001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.pwr001RevA,
      parentBomItemId: null,
      quantity: 1,
      position: 50,
    },
    {
      id: SEED_IDS.bomItems.com001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.com001RevA,
      parentBomItemId: null,
      quantity: 1,
      position: 60,
    },
  ];

  for (const item of rootItems) {
    await prisma.bomItem.upsert({
      where: { id: item.id },
      update: {
        bomId: item.bomId,
        componentRevisionId: item.componentRevisionId,
        parentBomItemId: item.parentBomItemId,
        quantity: item.quantity,
        position: item.position,
      },
      create: item,
    });
  }

  // 2. Seed nested assembly BOM items
  const nestedItems = [
    {
      id: SEED_IDS.bomItems.proc001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.proc001RevA,
      parentBomItemId: SEED_IDS.bomItems.ctrl001Item,
      quantity: 1,
      position: 10,
    },
    {
      id: SEED_IDS.bomItems.fw001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.fw001RevA,
      parentBomItemId: SEED_IDS.bomItems.ctrl001Item,
      quantity: 1,
      position: 20,
    },
    {
      id: SEED_IDS.bomItems.csen001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.csen001RevA,
      parentBomItemId: SEED_IDS.bomItems.cam001Item,
      quantity: 1,
      position: 10,
    },
    {
      id: SEED_IDS.bomItems.cfw001Item,
      bomId: bom.id,
      componentRevisionId: SEED_IDS.components.cfw001RevA,
      parentBomItemId: SEED_IDS.bomItems.cam001Item,
      quantity: 1,
      position: 20,
    },
  ];

  for (const item of nestedItems) {
    await prisma.bomItem.upsert({
      where: { id: item.id },
      update: {
        bomId: item.bomId,
        componentRevisionId: item.componentRevisionId,
        parentBomItemId: item.parentBomItemId,
        quantity: item.quantity,
        position: item.position,
      },
      create: item,
    });
  }

  const totalItems = rootItems.length + nestedItems.length;
  console.log(`✓ Seeded BOM for SAC-001 Rev A with ${totalItems} hierarchical items.`);
}
