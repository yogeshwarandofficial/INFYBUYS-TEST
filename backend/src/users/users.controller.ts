import { Controller, Get, UseGuards, Request, Patch, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/settings')
  async updateSettings(@Request() req: any, @Body() body: any) {
    return this.usersService.updateSettings(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteAccount(@Request() req: any) {
    return this.usersService.deleteUser(req.user.id);
  }
}
