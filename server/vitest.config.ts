import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    fileParallelism: false,
    include: ['src/**/*.test.ts'],
    exclude: ['dist/**'],
    pool: 'forks',
    minWorkers: 1,
    maxWorkers: 1,
  }
});
