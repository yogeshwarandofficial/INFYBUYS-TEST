import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SavedSearchesService } from './saved-searches.service.js';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto.js';
import { UpdateSavedSearchDto } from './dto/update-saved-search.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('saved-searches')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class SavedSearchesController {
  constructor(private readonly savedSearchesService: SavedSearchesService) {}

  @Post()
  create(@Request() req, @Body() createSavedSearchDto: CreateSavedSearchDto) {
    return this.savedSearchesService.create(req.user.id, createSavedSearchDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.savedSearchesService.findAllForBuyer(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.savedSearchesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateSavedSearchDto: UpdateSavedSearchDto) {
    return this.savedSearchesService.update(id, req.user.id, updateSavedSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.savedSearchesService.remove(id, req.user.id);
  }
}
