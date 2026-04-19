import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
}

export const userRepository = new UserRepository();
