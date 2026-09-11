import { ProductRevisionStatus } from '@prisma/client';
import { SEED_IDS } from './constants.js';
import type { SeedContext } from './types.js';

export async function seedComponents({ prisma }: SeedContext) {
  console.log('Seeding SAC-001 components and revisions...');

  const componentsData = [
    {
      id: SEED_IDS.components.ctrl001,
      revId: SEED_IDS.components.ctrl001RevA,
      componentNumber: 'CTRL-001',
      name: 'Main Controller',
      type: 'HARDWARE',
      description: 'Central processing and control board for SAC-001',
      revDescription: 'Initial approved baseline for Main Controller',
    },
    {
      id: SEED_IDS.components.proc001,
      revId: SEED_IDS.components.proc001RevA,
      componentNumber: 'PROC-001',
      name: 'Processor',
      type: 'HARDWARE',
      description: 'Embedded application processor for main controller',
      revDescription: 'Initial approved baseline for Processor',
    },
    {
      id: SEED_IDS.components.fw001,
      revId: SEED_IDS.components.fw001RevA,
      componentNumber: 'FW-001',
      name: 'Controller Firmware',
      type: 'FIRMWARE',
      description: 'Embedded OS and controller logic for main controller',
      revDescription: 'Initial approved baseline for Controller Firmware',
    },
    {
      id: SEED_IDS.components.cam001,
      revId: SEED_IDS.components.cam001RevA,
      componentNumber: 'CAM-001',
      name: 'Camera Assembly',
      type: 'HARDWARE',
      description: 'High-resolution optical camera assembly',
      revDescription: 'Initial approved baseline for Camera Assembly',
    },
    {
      id: SEED_IDS.components.csen001,
      revId: SEED_IDS.components.csen001RevA,
      componentNumber: 'CSEN-001',
      name: 'Camera Sensor',
      type: 'HARDWARE',
      description: 'CMOS image sensor array for optical capture',
      revDescription: 'Initial approved baseline for Camera Sensor',
    },
    {
      id: SEED_IDS.components.cfw001,
      revId: SEED_IDS.components.cfw001RevA,
      componentNumber: 'CFW-001',
      name: 'Camera Firmware',
      type: 'FIRMWARE',
      description: 'Image processing and recognition firmware',
      revDescription: 'Initial approved baseline for Camera Firmware',
    },
    {
      id: SEED_IDS.components.ir001,
      revId: SEED_IDS.components.ir001RevA,
      componentNumber: 'IR-001',
      name: 'IR Sensor',
      type: 'HARDWARE',
      description: 'Passive infrared proximity sensor for presence detection',
      revDescription: 'Initial approved baseline for IR Sensor',
    },
    {
      id: SEED_IDS.components.lock001,
      revId: SEED_IDS.components.lock001RevA,
      componentNumber: 'LOCK-001',
      name: 'Door Lock',
      type: 'ELECTROMECHANICAL',
      description: 'Electromagnetic door strike lock assembly',
      revDescription: 'Initial approved baseline for Door Lock',
    },
    {
      id: SEED_IDS.components.pwr001,
      revId: SEED_IDS.components.pwr001RevA,
      componentNumber: 'PWR-001',
      name: 'Power Supply',
      type: 'ELECTRICAL',
      description: '12V DC regulated power supply module',
      revDescription: 'Initial approved baseline for Power Supply',
    },
    {
      id: SEED_IDS.components.com001,
      revId: SEED_IDS.components.com001RevA,
      componentNumber: 'COM-001',
      name: 'Communication Module',
      type: 'HARDWARE',
      description: 'Ethernet and Wi-Fi interface board',
      revDescription: 'Initial approved baseline for Communication Module',
    },
  ];

  for (const comp of componentsData) {
    const dbComp = await prisma.component.upsert({
      where: { componentNumber: comp.componentNumber },
      update: {
        name: comp.name,
        type: comp.type,
        description: comp.description,
        createdBy: SEED_IDS.users.engineer,
      },
      create: {
        id: comp.id,
        componentNumber: comp.componentNumber,
        name: comp.name,
        type: comp.type,
        description: comp.description,
        createdBy: SEED_IDS.users.engineer,
      },
    });

    await prisma.componentRevision.upsert({
      where: {
        componentId_revisionNumber: {
          componentId: dbComp.id,
          revisionNumber: 1,
        },
      },
      update: {
        displayCode: 'A',
        status: ProductRevisionStatus.APPROVED,
        description: comp.revDescription,
        createdBy: SEED_IDS.users.engineer,
      },
      create: {
        id: comp.revId,
        componentId: dbComp.id,
        revisionNumber: 1,
        displayCode: 'A',
        status: ProductRevisionStatus.APPROVED,
        description: comp.revDescription,
        createdBy: SEED_IDS.users.engineer,
      },
    });
  }

  console.log(`✓ Seeded ${componentsData.length} components and revisions.`);
}
