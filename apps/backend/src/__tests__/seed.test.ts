import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { SEED_IDS } from '../../prisma/seed/constants.js';

describe('Seed Data Definitions & Golden Scenario Structure', () => {
  it('should have deterministic UUIDs for all roles', () => {
    expect(SEED_IDS.roles.admin).toBe('00000000-0000-4000-a001-000000000001');
    expect(SEED_IDS.roles.engineer).toBe('00000000-0000-4000-a001-000000000002');
    expect(SEED_IDS.roles.reviewer).toBe('00000000-0000-4000-a001-000000000003');
    expect(SEED_IDS.roles.viewer).toBe('00000000-0000-4000-a001-000000000004');
  });

  it('should have deterministic UUIDs for SAC-001 product and revision', () => {
    expect(SEED_IDS.products.sac001).toBe('00000000-0000-4000-b001-000000000001');
    expect(SEED_IDS.products.sac001RevA).toBe('00000000-0000-4000-b002-000000000001');
  });

  it('should define exactly 10 components for SAC-001 golden scenario', () => {
    const componentKeys = Object.keys(SEED_IDS.components).filter(
      (k) => !k.endsWith('RevA'),
    );
    expect(componentKeys).toHaveLength(10);
    expect(componentKeys).toEqual([
      'ctrl001',
      'proc001',
      'fw001',
      'cam001',
      'csen001',
      'cfw001',
      'ir001',
      'lock001',
      'pwr001',
      'com001',
    ]);
  });

  it('should define exactly 10 BOM items matching components', () => {
    const bomItemKeys = Object.keys(SEED_IDS.bomItems);
    expect(bomItemKeys).toHaveLength(10);
  });

  it('should define exactly 4 requirements REQ-001 to REQ-004', () => {
    const reqKeys = Object.keys(SEED_IDS.requirements).filter(
      (k) => !k.endsWith('RevA'),
    );
    expect(reqKeys).toHaveLength(4);
    expect(reqKeys).toEqual(['req001', 'req002', 'req003', 'req004']);
  });

  it('should define 5 dependencies matching the golden scenario graph', () => {
    const depKeys = Object.keys(SEED_IDS.dependencies);
    expect(depKeys).toHaveLength(5);
    expect(depKeys).toEqual([
      'cfwToCam',
      'camToCtrl',
      'ctrlToSac',
      'fwToProc',
      'procToCtrl',
    ]);
  });

  it('should not define any change request, impact, or workflow seed fixtures', () => {
    // Verify that seed constants contain NO fixtures for workflow or change management
    expect(SEED_IDS).not.toHaveProperty('changeRequests');
    expect(SEED_IDS).not.toHaveProperty('impactAnalyses');
    expect(SEED_IDS).not.toHaveProperty('workflowDefinitions');
    expect(SEED_IDS).not.toHaveProperty('workflowInstances');
    expect(SEED_IDS).not.toHaveProperty('workflowTasks');
  });

  it('should verify that the dependency graph is directed and acyclic', () => {
    // Model edges: source -> target
    const edges = [
      { source: SEED_IDS.components.cfw001RevA, target: SEED_IDS.components.cam001RevA },
      { source: SEED_IDS.components.cam001RevA, target: SEED_IDS.components.ctrl001RevA },
      { source: SEED_IDS.components.ctrl001RevA, target: SEED_IDS.products.sac001RevA },
      { source: SEED_IDS.components.fw001RevA, target: SEED_IDS.components.proc001RevA },
      { source: SEED_IDS.components.proc001RevA, target: SEED_IDS.components.ctrl001RevA },
    ];

    // Build adjacency list
    const adj = new Map<string, string[]>();
    for (const { source, target } of edges) {
      if (!adj.has(source)) adj.set(source, []);
      adj.get(source)!.push(target);
    }

    // Cycle detection via DFS
    const visited = new Set<string>();
    const inStack = new Set<string>();

    function hasCycle(node: string): boolean {
      visited.add(node);
      inStack.add(node);

      for (const neighbor of adj.get(node) || []) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (inStack.has(neighbor)) {
          return true;
        }
      }

      inStack.delete(node);
      return false;
    }

    for (const { source } of edges) {
      if (!visited.has(source)) {
        expect(hasCycle(source)).toBe(false);
      }
    }

    // Verify traversal path from CFW-001 reaches SAC-001 in 3 steps
    function getPath(current: string, target: string, path: string[] = []): string[] | null {
      path.push(current);
      if (current === target) return path;
      for (const next of adj.get(current) || []) {
        const found = getPath(next, target, [...path]);
        if (found) return found;
      }
      return null;
    }

    const path = getPath(SEED_IDS.components.cfw001RevA, SEED_IDS.products.sac001RevA);
    expect(path).not.toBeNull();
    expect(path).toEqual([
      SEED_IDS.components.cfw001RevA,
      SEED_IDS.components.cam001RevA,
      SEED_IDS.components.ctrl001RevA,
      SEED_IDS.products.sac001RevA,
    ]);
  });
});

const isDbConfigured = Boolean(process.env.DATABASE_URL);

describe.skipIf(!isDbConfigured)('Database Foundation & Seed Integration', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should have exactly 4 seeded roles', async () => {
    const roles = await prisma.role.findMany();
    expect(roles).toHaveLength(4);
    const roleNames = roles.map((r) => r.name).sort();
    expect(roleNames).toEqual(['ADMIN', 'ENGINEER', 'REVIEWER', 'VIEWER']);
  });

  it('should have exactly 4 seeded users with role assignments', async () => {
    const users = await prisma.user.findMany({
      include: { userRoles: { include: { role: true } } },
    });
    expect(users).toHaveLength(4);
    for (const user of users) {
      expect(user.isActive).toBe(true);
      expect(user.userRoles).toHaveLength(1);
    }
  });

  it('should have SAC-001 product with Revision A in APPROVED state', async () => {
    const product = await prisma.product.findUnique({
      where: { productNumber: 'SAC-001' },
      include: { revisions: true },
    });
    expect(product).not.toBeNull();
    expect(product!.revisions).toHaveLength(1);
    expect(product!.revisions[0].revisionNumber).toBe(1);
    expect(product!.revisions[0].displayCode).toBe('A');
    expect(product!.revisions[0].status).toBe('APPROVED');
  });

  it('should have 10 components with Revision A in APPROVED state', async () => {
    const components = await prisma.component.findMany({
      include: { revisions: true },
    });
    expect(components).toHaveLength(10);
    for (const comp of components) {
      expect(comp.revisions).toHaveLength(1);
      expect(comp.revisions[0].revisionNumber).toBe(1);
      expect(comp.revisions[0].displayCode).toBe('A');
      expect(comp.revisions[0].status).toBe('APPROVED');
    }
  });

  it('should have SAC-001 BOM with correct hierarchical structure and quantity > 0', async () => {
    const bom = await prisma.bom.findUnique({
      where: { productRevisionId: SEED_IDS.products.sac001RevA },
      include: {
        items: {
          include: {
            componentRevision: { include: { component: true } },
            children: true,
          },
        },
      },
    });
    expect(bom).not.toBeNull();
    expect(bom!.items).toHaveLength(10);

    // Verify all quantities are positive
    for (const item of bom!.items) {
      expect(item.quantity).toBeGreaterThan(0);
    }

    // Root items: 6 (parentBomItemId is null)
    const rootItems = bom!.items.filter((item) => item.parentBomItemId === null);
    expect(rootItems).toHaveLength(6);

    // Nested items: 4 (parentBomItemId is not null)
    const nestedItems = bom!.items.filter((item) => item.parentBomItemId !== null);
    expect(nestedItems).toHaveLength(4);

    // Verify CTRL-001 has 2 sub-items: PROC-001 and FW-001
    const ctrlItem = rootItems.find(
      (item) => item.componentRevision.component.componentNumber === 'CTRL-001',
    );
    expect(ctrlItem).toBeDefined();
    expect(ctrlItem!.children).toHaveLength(2);

    // Verify CAM-001 has 2 sub-items: CSEN-001 and CFW-001
    const camItem = rootItems.find(
      (item) => item.componentRevision.component.componentNumber === 'CAM-001',
    );
    expect(camItem).toBeDefined();
    expect(camItem!.children).toHaveLength(2);
  });

  it('should have requirements REQ-001 through REQ-004 in APPROVED state with traceability', async () => {
    const requirements = await prisma.requirement.findMany({
      include: {
        revisions: {
          include: {
            productLinks: true,
            componentLinks: true,
          },
        },
      },
    });
    expect(requirements).toHaveLength(4);

    let totalProductLinks = 0;
    let totalComponentLinks = 0;

    for (const req of requirements) {
      expect(req.revisions).toHaveLength(1);
      expect(req.revisions[0].revisionNumber).toBe(1);
      expect(req.revisions[0].displayCode).toBe('A');
      expect(req.revisions[0].status).toBe('APPROVED');
      totalProductLinks += req.revisions[0].productLinks.length;
      totalComponentLinks += req.revisions[0].componentLinks.length;
    }

    expect(totalProductLinks).toBe(3);
    expect(totalComponentLinks).toBe(8);
  });

  it('should have exactly 5 dependency edges matching the golden scenario', async () => {
    const dependencies = await prisma.dependency.findMany();
    expect(dependencies).toHaveLength(5);
  });

  it('should confirm that no change management, workflow, or document records were seeded', async () => {
    const changeRequests = await prisma.changeRequest.count();
    const impactAnalyses = await prisma.impactAnalysis.count();
    const workflowInstances = await prisma.workflowInstance.count();
    const workflowTasks = await prisma.workflowTask.count();
    const documents = await prisma.document.count();
    const auditEvents = await prisma.auditEvent.count();

    expect(changeRequests).toBe(0);
    expect(impactAnalyses).toBe(0);
    expect(workflowInstances).toBe(0);
    expect(workflowTasks).toBe(0);
    expect(documents).toBe(0);
    expect(auditEvents).toBe(0);
  });
});
