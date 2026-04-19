import { PrismaClient, User } from '@prisma/client';
import { prisma as defaultPrisma } from '../infrastructure/prisma';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
