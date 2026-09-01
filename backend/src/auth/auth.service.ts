import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Role } from '../../generated/prisma/client.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private async generateRefreshToken(userId: string): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresInDays = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || '7', 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return rawToken;
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.usersService.create({
      name,
      email: normalizedEmail,
      passwordHash,
      roles: [Role.BUYER],
    });

    if (process.env.EMAIL_VERIFICATION_ENABLED === 'true') {
      try {
        await this.sendVerificationEmail(user.id, user.email);
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }
    }

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const verificationEnabled = process.env.EMAIL_VERIFICATION_ENABLED === 'true';
    if (verificationEnabled && !user.verifiedAt) {
      throw new UnauthorizedException('Email not verified');
    }

    const payload = { sub: user.id, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.usersService.findById(storedToken.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (storedToken) {
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });
    }

    return { message: 'Logged out successfully' };
  }

  async sendVerificationEmail(userId: string, email: string) {
    const payload = { sub: userId, type: 'email-verification' };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1d' });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationLink = `${frontendUrl}/verify-email/confirm?token=${token}`;
    console.log(`\n\n=== MOCK EMAIL SERVICE ===\nTo: ${email}\nSubject: Verify your email\nLink: ${verificationLink}\n==========================\n\n`);
  }

  async verifyEmail(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Invalid token type');
      }
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.verifiedAt) {
        return { message: 'Email already verified' };
      }
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { verifiedAt: new Date() },
      });
      
      return { message: 'Email successfully verified' };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
  }

  async resendVerificationEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      // Don't leak whether user exists
      return { message: 'If the email exists, a verification link has been sent.' };
    }
    if (user.verifiedAt) {
      return { message: 'Email already verified' };
    }
    await this.sendVerificationEmail(user.id, user.email);
    return { message: 'Verification email resent.' };
  }
}
