import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { SubscriptionGuard } from './guards/subscription.guard.js';
import { Roles } from './decorators/roles.decorator.js';
import { RequiresSubscription } from './decorators/subscription.decorator.js';
import { Role, SubscriptionAudience } from '@prisma/client';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { GoogleLoginDto } from './dto/google-login.dto.js';
import { SendOtpDto } from './dto/send-otp.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(googleLoginDto.token);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  // ─── OTP endpoints ───────────────────────────────────────────────────────

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.authService.resendOtp(dto.email);
    return { message: 'Verification code sent' };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @Get('test/buyer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  testBuyer() {
    return { success: true, message: 'Buyer access granted' };
  }

  @Get('test/seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  testSeller() {
    return { success: true, message: 'Seller access granted' };
  }

  @Get('test/buyer-subscription')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(Role.BUYER)
  @RequiresSubscription(SubscriptionAudience.BUYER)
  testBuyerSubscription() {
    return { success: true, message: 'Buyer subscription access granted' };
  }
}
