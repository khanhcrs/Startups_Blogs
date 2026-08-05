import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce({ id: '1' });
      await expect(
        authService.register({ email: 'test@test.com', password: '123', name: 'Test' })
      ).rejects.toThrow(ConflictException);
    });

    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_pw');
      mockUsersService.createUser.mockResolvedValueOnce({ id: '1', email: 'test@test.com', name: 'Test' });
      mockJwtService.signAsync.mockResolvedValueOnce('token');

      const result = await authService.register({ email: 'test@test.com', password: '123', name: 'Test' });

      expect(usersService.createUser).toHaveBeenCalledWith({ email: 'test@test.com', password: 'hashed_pw', name: 'Test' });
      expect(result).toEqual({
        access_token: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test' },
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid email', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      await expect(authService.login({ email: 'test@test.com', password: '123' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce({ password: 'hashed_pw' });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(authService.login({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });

    it('should return token for valid login', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce({ id: '1', email: 'test@test.com', name: 'Test', password: 'hashed_pw' });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      mockJwtService.signAsync.mockResolvedValueOnce('token');

      const result = await authService.login({ email: 'test@test.com', password: '123' });
      expect(result).toEqual({
        access_token: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test' },
      });
    });
  });
});
