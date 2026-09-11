import { DependencyRelationshipType } from '@prisma/client';
import { SEED_IDS } from './constants.js';
import type { SeedContext } from './types.js';

export async function seedDependencies({ prisma }: SeedContext) {
  console.log('Seeding engineering dependencies...');

  const dependenciesData = [
    {
      id: SEED_IDS.dependencies.cfwToCam,
      sourceType: 'COMPONENT_REVISION',
      sourceId: SEED_IDS.components.cfw001RevA,
      targetType: 'COMPONENT_REVISION',
      targetId: SEED_IDS.components.cam001RevA,
      relationshipType: DependencyRelationshipType.DEPENDS_ON,
    },
    {
      id: SEED_IDS.dependencies.camToCtrl,
      sourceType: 'COMPONENT_REVISION',
      sourceId: SEED_IDS.components.cam001RevA,
      targetType: 'COMPONENT_REVISION',
      targetId: SEED_IDS.components.ctrl001RevA,
      relationshipType: DependencyRelationshipType.PART_OF,
    },
    {
      id: SEED_IDS.dependencies.ctrlToSac,
      sourceType: 'COMPONENT_REVISION',
      sourceId: SEED_IDS.components.ctrl001RevA,
      targetType: 'PRODUCT_REVISION',
      targetId: SEED_IDS.products.sac001RevA,
      relationshipType: DependencyRelationshipType.PART_OF,
    },
    {
      id: SEED_IDS.dependencies.fwToProc,
      sourceType: 'COMPONENT_REVISION',
      sourceId: SEED_IDS.components.fw001RevA,
      targetType: 'COMPONENT_REVISION',
      targetId: SEED_IDS.components.proc001RevA,
      relationshipType: DependencyRelationshipType.DEPENDS_ON,
    },
    {
      id: SEED_IDS.dependencies.procToCtrl,
      sourceType: 'COMPONENT_REVISION',
      sourceId: SEED_IDS.components.proc001RevA,
      targetType: 'COMPONENT_REVISION',
      targetId: SEED_IDS.components.ctrl001RevA,
      relationshipType: DependencyRelationshipType.PART_OF,
    },
  ];

  for (const dep of dependenciesData) {
    await prisma.dependency.upsert({
      where: {
        sourceType_sourceId_targetType_targetId_relationshipType: {
          sourceType: dep.sourceType,
          sourceId: dep.sourceId,
          targetType: dep.targetType,
          targetId: dep.targetId,
          relationshipType: dep.relationshipType,
        },
      },
      update: {
        createdBy: SEED_IDS.users.engineer,
      },
      create: {
        id: dep.id,
        sourceType: dep.sourceType,
        sourceId: dep.sourceId,
        targetType: dep.targetType,
        targetId: dep.targetId,
        relationshipType: dep.relationshipType,
        createdBy: SEED_IDS.users.engineer,
      },
    });
  }

  console.log(`✓ Seeded ${dependenciesData.length} dependency edges.`);
}
