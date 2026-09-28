import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Role } from '../../generated/prisma/client.js';
import { Resend } from 'resend';

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

    // Always send OTP after registration for email verification
    try {
      await this.sendOtpEmail(user.id, user.email);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
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

  async googleLogin(token: string) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('Google Login is not configured on this server');
    }

    try {
      // With @react-oauth/google useGoogleLogin, we get an access_token.
      // We use it to fetch the user's profile from Google.
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const payload = await response.json();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      const email = payload.email.trim().toLowerCase();
      let user = await this.usersService.findByEmail(email);

      if (!user) {
        // Create a new user account if they don't exist
        user = await this.usersService.create({
          name: payload.name || 'Google User',
          email: email,
          passwordHash: null, // No password for OAuth users
          roles: [Role.BUYER], // Default role
        });
        
        // Auto verify email since Google verified it
        await this.prisma.user.update({
          where: { id: user.id },
          data: { verifiedAt: new Date() }
        });
      }

      // Check if they are verified if process.env.EMAIL_VERIFICATION_ENABLED
      const verificationEnabled = process.env.EMAIL_VERIFICATION_ENABLED === 'true';
      if (verificationEnabled && !user.verifiedAt) {
        // Just in case, update it since they logged in via Google
        await this.prisma.user.update({
          where: { id: user.id },
          data: { verifiedAt: new Date() }
        });
      }

      const jwtPayload = { sub: user.id, roles: user.roles };
      const accessToken = await this.jwtService.signAsync(jwtPayload);
      const refreshToken = await this.generateRefreshToken(user.id);

      const { passwordHash: _, ...userWithoutPassword } = user;

      return {
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
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

  // ─── OTP Email Verification ───────────────────────────────────────────────

  /**
   * Generates a 6-digit OTP, hashes it, and stores it in the DB.
   * Deletes any previous unused OTPs for this email first.
   * Sends the plain OTP to the user's email via Resend.
   */
  async sendOtpEmail(userId: string, email: string): Promise<void> {
    // Delete any existing unused OTPs for this user to prevent accumulation
    await this.prisma.otpVerification.deleteMany({
      where: { userId, usedAt: null },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.otpVerification.create({
      data: { userId, email: email.trim().toLowerCase(), otpHash, expiresAt },
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'INFYBUYS <onboarding@resend.dev>',
      to: email,
      subject: 'Your INFYBUYS verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #1a1a1a; margin-bottom: 8px;">Verify your email</h2>
          <p style="color: #555; margin-bottom: 24px;">Use the code below to verify your INFYBUYS account. It expires in <strong>10 minutes</strong>.</p>
          <div style="background: #fff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #111;">${otp}</span>
          </div>
          <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new BadRequestException('Failed to send verification email. Please try again.');
    }
  }

  /**
   * Re-sends a fresh OTP to the given email.
   * Returns silently regardless of whether the email exists to prevent
   * user-enumeration attacks. The frontend should always show a generic
   * "If the account exists, a code was sent" message.
   */
  async resendOtp(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user || user.verifiedAt) {
      // Return silently — do not reveal whether the email is registered
      return;
    }
    await this.sendOtpEmail(user.id, normalizedEmail);
  }

  /**
   * Verifies the OTP submitted by the user against the hashed value in DB.
   * Tracks attempts (max 3). Enforces single-use and expiry.
   */
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    const record = await this.prisma.otpVerification.findFirst({
      where: {
        email: normalizedEmail,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Verification code has expired or was not found. Please request a new one.');
    }

    if (record.attempts >= 3) {
      throw new BadRequestException('Too many failed attempts. Please request a new verification code.');
    }

    const submittedHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (submittedHash !== record.otpHash) {
      await this.prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const attemptsLeft = 2 - record.attempts;
      throw new UnauthorizedException(
        `Invalid verification code. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining.` : 'Please request a new code.'}`
      );
    }

    // Mark OTP as used
    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    // Mark user as verified
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { verifiedAt: new Date() },
    });

    return { message: 'Email successfully verified' };
  }

}
