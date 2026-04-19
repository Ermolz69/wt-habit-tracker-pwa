import { PrismaClient } from '@prisma/client';

declare global {
   
  var __habitTrackerPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__habitTrackerPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__habitTrackerPrisma__ = prisma;
}
