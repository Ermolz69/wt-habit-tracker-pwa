import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../common/errors/app-error';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  const userRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    findByUsername: vi.fn(),
  } as unknown as UserRepository;

  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService(userRepository);
  });

  it('registers new user', async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue(null);
    vi.mocked(userRepository.create).mockResolvedValue({
      id: 'user-1',
      username: 'john',
      password: await bcrypt.hash('password123', 10),
      createdAt: new Date(),
    });

    const result = await service.register('john', 'password123');

    expect(result.user.username).toBe('john');
    expect(jwt.verify(result.token, process.env.JWT_SECRET || 'super-secret-key-123')).toMatchObject({
      userId: 'user-1',
    });
  });

  it('rejects duplicate username on register', async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue({
      id: 'user-1',
      username: 'john',
      password: 'hashed',
      createdAt: new Date(),
    });

    await expect(service.register('john', 'password123')).rejects.toMatchObject({
      message: 'Username already exists',
      statusCode: 400,
    });
  });

  it('logs in user with valid credentials', async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue({
      id: 'user-1',
      username: 'john',
      password: await bcrypt.hash('password123', 10),
      createdAt: new Date(),
    });

    const result = await service.login('john', 'password123');

    expect(result.user.id).toBe('user-1');
    expect(result.token).toBeTypeOf('string');
  });

  it('rejects invalid credentials on login', async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue(null);

    await expect(service.login('john', 'wrong')).rejects.toMatchObject({
      message: 'Invalid credentials',
      statusCode: 401,
    });
  });

  it('rejects login when password does not match', async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue({
      id: 'user-1',
      username: 'john',
      password: await bcrypt.hash('password123', 10),
      createdAt: new Date(),
    });

    await expect(service.login('john', 'wrong-password')).rejects.toMatchObject({
      message: 'Invalid credentials',
      statusCode: 401,
    });
  });

  it('returns user profile', async () => {
    const createdAt = new Date();
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 'user-1',
      username: 'john',
      password: 'hashed',
      createdAt,
    });

    await expect(service.getProfile('user-1')).resolves.toEqual({
      id: 'user-1',
      username: 'john',
      createdAt,
    });
  });

  it('throws when profile user does not exist', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(service.getProfile('user-1')).rejects.toMatchObject({
      message: 'User not found',
      statusCode: 404,
    });
  });
});
