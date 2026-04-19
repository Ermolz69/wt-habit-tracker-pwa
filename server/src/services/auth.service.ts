import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../common/errors/app-error';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'super-secret-key-123', {
      expiresIn: '7d',
    });
  }

  async register(username: string, passwordRaw: string) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new AppError('Username already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);
    return { user: { id: user.id, username: user.username }, token };
  }

  async login(username: string, passwordRaw: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(passwordRaw, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user.id);
    return { user: { id: user.id, username: user.username }, token };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return { id: user.id, username: user.username, createdAt: user.createdAt };
  }
}
