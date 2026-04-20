import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import { beforeAll, afterAll, afterEach } from 'vitest';

dotenv.config({ path: '.env.test' });

const testDatabasePath = path.resolve(process.cwd(), 'prisma', 'test.db').replace(/\\/g, '/');
process.env.DATABASE_URL = `file:${testDatabasePath}`;

beforeAll(() => {
  // Push the schema to the test database
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  });
});

afterEach(async () => {
  // Clean the database after each test
  const { resetTestDb } = await import('./helpers');
  await resetTestDb();
});

afterAll(async () => {
  const { prisma } = await import('../infrastructure/prisma');
  await prisma.$disconnect();
});
