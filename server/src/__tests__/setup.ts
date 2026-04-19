import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { prisma } from '../infrastructure/prisma';

dotenv.config({ path: '.env.test' });

beforeAll(() => {
  // Push the schema to the test database
  execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: 'file:./test.db' } });
});

afterEach(async () => {
  // Clean the database after each test
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
