import { RoleName } from '@prisma/client';
import { SEED_IDS, SEED_PASSWORD_HASH } from './constants.js';
import type { SeedContext } from './types.js';

export async function seedRolesAndUsers({ prisma }: SeedContext) {
  console.log('Seeding roles and users...');

  const rolesData = [
    {
      id: SEED_IDS.roles.admin,
      name: RoleName.ADMIN,
      description: 'System Administrator with full management privileges',
      permissions: ['*'],
    },
    {
      id: SEED_IDS.roles.engineer,
      name: RoleName.ENGINEER,
      description: 'Product Engineer responsible for product design and changes',
      permissions: [
        'PRODUCT_CREATE',
        'PRODUCT_EDIT',
        'COMPONENT_CREATE',
        'COMPONENT_EDIT',
        'BOM_EDIT',
        'REQUIREMENT_CREATE',
        'REQUIREMENT_EDIT',
        'CHANGE_CREATE',
      ],
    },
    {
      id: SEED_IDS.roles.reviewer,
      name: RoleName.REVIEWER,
      description: 'Engineering Reviewer responsible for change approvals',
      permissions: [
        'CHANGE_REVIEW',
        'CHANGE_APPROVE',
        'PRODUCT_VIEW',
        'BOM_VIEW',
        'IMPACT_VIEW',
      ],
    },
    {
      id: SEED_IDS.roles.viewer,
      name: RoleName.VIEWER,
      description: 'Read-only viewer for engineering data',
      permissions: [
        'PRODUCT_VIEW',
        'COMPONENT_VIEW',
        'BOM_VIEW',
        'REQUIREMENT_VIEW',
        'CHANGE_VIEW',
      ],
    },
  ];

  for (const role of rolesData) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
        permissions: role.permissions,
      },
      create: role,
    });
  }

  const usersData = [
    {
      id: SEED_IDS.users.admin,
      email: 'admin@openplm.dev',
      firstName: 'Alice',
      lastName: 'Admin',
      passwordHash: SEED_PASSWORD_HASH,
      isActive: true,
      roleName: RoleName.ADMIN,
      roleId: SEED_IDS.roles.admin,
    },
    {
      id: SEED_IDS.users.engineer,
      email: 'engineer@openplm.dev',
      firstName: 'Bob',
      lastName: 'Engineer',
      passwordHash: SEED_PASSWORD_HASH,
      isActive: true,
      roleName: RoleName.ENGINEER,
      roleId: SEED_IDS.roles.engineer,
    },
    {
      id: SEED_IDS.users.reviewer,
      email: 'reviewer@openplm.dev',
      firstName: 'Rachel',
      lastName: 'Reviewer',
      passwordHash: SEED_PASSWORD_HASH,
      isActive: true,
      roleName: RoleName.REVIEWER,
      roleId: SEED_IDS.roles.reviewer,
    },
    {
      id: SEED_IDS.users.viewer,
      email: 'viewer@openplm.dev',
      firstName: 'Victor',
      lastName: 'Viewer',
      passwordHash: SEED_PASSWORD_HASH,
      isActive: true,
      roleName: RoleName.VIEWER,
      roleId: SEED_IDS.roles.viewer,
    },
  ];

  for (const user of usersData) {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
      },
      create: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: user.passwordHash,
        isActive: user.isActive,
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: dbUser.id,
          roleId: user.roleId,
        },
      },
      update: {},
      create: {
        userId: dbUser.id,
        roleId: user.roleId,
      },
    });
  }

  console.log(`✓ Seeded ${rolesData.length} roles and ${usersData.length} users with role assignments.`);
}
