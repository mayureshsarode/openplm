import { describe, it, expect } from 'vitest';
import { SEED_IDS } from '../../prisma/seed/constants.js';

describe('Seed Data Definitions', () => {
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
    expect(componentKeys).toContain('ctrl001');
    expect(componentKeys).toContain('proc001');
    expect(componentKeys).toContain('fw001');
    expect(componentKeys).toContain('cam001');
    expect(componentKeys).toContain('csen001');
    expect(componentKeys).toContain('cfw001');
    expect(componentKeys).toContain('ir001');
    expect(componentKeys).toContain('lock001');
    expect(componentKeys).toContain('pwr001');
    expect(componentKeys).toContain('com001');
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
});
