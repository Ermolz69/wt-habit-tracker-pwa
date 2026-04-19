import { describe, expect, it } from 'vitest';
import { UserRepository } from '../repositories/user.repository';
import { prisma } from '../infrastructure/prisma';

describe('UserRepository', () => {
  const repository = new UserRepository(prisma);

  it('creates a user', async () => {
    const user = await repository.create({
      username: 'repo-user',
      password: 'hashed-password',
    });

    expect(user.id).toBeDefined();
    expect(user.username).toBe('repo-user');
  });

  it('finds user by username', async () => {
    await repository.create({
      username: 'find-by-name',
      password: 'hashed-password',
    });

    const user = await repository.findByUsername('find-by-name');

    expect(user?.username).toBe('find-by-name');
  });

  it('finds user by id', async () => {
    const createdUser = await repository.create({
      username: 'find-by-id',
      password: 'hashed-password',
    });

    const user = await repository.findById(createdUser.id);

    expect(user?.id).toBe(createdUser.id);
  });
});
