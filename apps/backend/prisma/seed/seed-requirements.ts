import { RequirementPriority, RequirementRevisionStatus } from '@prisma/client';
import { SEED_IDS } from './constants.js';
import type { SeedContext } from './types.js';

export async function seedRequirements({ prisma }: SeedContext) {
  console.log('Seeding requirements, revisions, and traceability links...');

  const requirementsData = [
    {
      id: SEED_IDS.requirements.req001,
      revId: SEED_IDS.requirements.req001RevA,
      requirementNumber: 'REQ-001',
      title: 'System shall support facial authentication',
      priority: RequirementPriority.CRITICAL,
      content:
        'The system shall support facial authentication using optical camera and biometric analysis.',
      productLinks: [SEED_IDS.products.sac001RevA],
      componentLinks: [
        SEED_IDS.components.cam001RevA,
        SEED_IDS.components.cfw001RevA,
      ],
    },
    {
      id: SEED_IDS.requirements.req002,
      revId: SEED_IDS.requirements.req002RevA,
      requirementNumber: 'REQ-002',
      title: 'Authentication response shall be below 1 second',
      priority: RequirementPriority.HIGH,
      content:
        'The complete authentication response shall be delivered in under 1 second under normal operating conditions.',
      productLinks: [SEED_IDS.products.sac001RevA],
      componentLinks: [
        SEED_IDS.components.ctrl001RevA,
        SEED_IDS.components.cfw001RevA,
      ],
    },
    {
      id: SEED_IDS.requirements.req003,
      revId: SEED_IDS.requirements.req003RevA,
      requirementNumber: 'REQ-003',
      title: 'Facial authentication shall work under low-light conditions',
      priority: RequirementPriority.HIGH,
      content:
        'Facial authentication shall remain functional and meet accuracy thresholds under low-light conditions (minimum 5 lux).',
      productLinks: [],
      componentLinks: [
        SEED_IDS.components.cam001RevA,
        SEED_IDS.components.csen001RevA,
        SEED_IDS.components.cfw001RevA,
      ],
    },
    {
      id: SEED_IDS.requirements.req004,
      revId: SEED_IDS.requirements.req004RevA,
      requirementNumber: 'REQ-004',
      title: 'Unauthorized access attempts shall be logged',
      priority: RequirementPriority.MEDIUM,
      content:
        'The system shall log all unauthorized access attempts with timestamp and captured diagnostic details.',
      productLinks: [SEED_IDS.products.sac001RevA],
      componentLinks: [SEED_IDS.components.ctrl001RevA],
    },
  ];

  let totalProductLinks = 0;
  let totalComponentLinks = 0;

  for (const req of requirementsData) {
    const dbReq = await prisma.requirement.upsert({
      where: { requirementNumber: req.requirementNumber },
      update: {
        title: req.title,
        priority: req.priority,
        createdBy: SEED_IDS.users.engineer,
      },
      create: {
        id: req.id,
        requirementNumber: req.requirementNumber,
        title: req.title,
        priority: req.priority,
        createdBy: SEED_IDS.users.engineer,
      },
    });

    const dbRev = await prisma.requirementRevision.upsert({
      where: {
        requirementId_revisionNumber: {
          requirementId: dbReq.id,
          revisionNumber: 1,
        },
      },
      update: {
        displayCode: 'A',
        content: req.content,
        status: RequirementRevisionStatus.APPROVED,
        createdBy: SEED_IDS.users.engineer,
      },
      create: {
        id: req.revId,
        requirementId: dbReq.id,
        revisionNumber: 1,
        displayCode: 'A',
        content: req.content,
        status: RequirementRevisionStatus.APPROVED,
        createdBy: SEED_IDS.users.engineer,
      },
    });

    for (const productRevisionId of req.productLinks) {
      await prisma.requirementProductLink.upsert({
        where: {
          requirementRevisionId_productRevisionId: {
            requirementRevisionId: dbRev.id,
            productRevisionId,
          },
        },
        update: {},
        create: {
          requirementRevisionId: dbRev.id,
          productRevisionId,
        },
      });
      totalProductLinks++;
    }

    for (const componentRevisionId of req.componentLinks) {
      await prisma.requirementComponentLink.upsert({
        where: {
          requirementRevisionId_componentRevisionId: {
            requirementRevisionId: dbRev.id,
            componentRevisionId,
          },
        },
        update: {},
        create: {
          requirementRevisionId: dbRev.id,
          componentRevisionId,
        },
      });
      totalComponentLinks++;
    }
  }

  console.log(
    `✓ Seeded ${requirementsData.length} requirements/revisions, ${totalProductLinks} product links, and ${totalComponentLinks} component links.`,
  );
}
