import type { PrismaClient } from '@prisma/client';

export interface SeedContext {
  prisma: PrismaClient;
}

export interface SeedResult {
  step: string;
  count: number;
}
