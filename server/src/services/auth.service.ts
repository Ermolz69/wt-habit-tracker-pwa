import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';

export class AuthService {
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'super-secret-key-123', {
      expiresIn: '7d',
    });
  }

  async register(username: string, passwordRaw: string) {
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    const user = await userRepository.create({
      username,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);
    return { user: { id: user.id, username: user.username }, token };
  }

  async login(username: string, passwordRaw: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordRaw, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user: { id: user.id, username: user.username }, token };
  }

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, username: user.username, createdAt: user.createdAt };
  }
}

export const authService = new AuthService();
