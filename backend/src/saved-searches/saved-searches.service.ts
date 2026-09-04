import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto.js';
import { UpdateSavedSearchDto } from './dto/update-saved-search.dto.js';

@Injectable()
export class SavedSearchesService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, createSavedSearchDto: CreateSavedSearchDto) {
    // Validate minPrice and maxPrice
    if (
      createSavedSearchDto.minPrice !== undefined && 
      createSavedSearchDto.maxPrice !== undefined && 
      createSavedSearchDto.minPrice > createSavedSearchDto.maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    return this.prisma.savedSearch.create({
      data: {
        ...createSavedSearchDto,
        buyerId,
      },
    });
  }

  async findAllForBuyer(buyerId: string) {
    return this.prisma.savedSearch.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, buyerId: string) {
    const savedSearch = await this.prisma.savedSearch.findUnique({
      where: { id },
    });

    if (!savedSearch) {
      throw new NotFoundException(`Saved search with ID ${id} not found`);
    }

    if (savedSearch.buyerId !== buyerId) {
      throw new ForbiddenException('You do not have permission to access this saved search');
    }

    return savedSearch;
  }

  async update(id: string, buyerId: string, updateSavedSearchDto: UpdateSavedSearchDto) {
    const savedSearch = await this.findOne(id, buyerId); // Checks existence and ownership

    // Validate minPrice and maxPrice during update
    const minPrice = updateSavedSearchDto.minPrice !== undefined ? updateSavedSearchDto.minPrice : savedSearch.minPrice;
    const maxPrice = updateSavedSearchDto.maxPrice !== undefined ? updateSavedSearchDto.maxPrice : savedSearch.maxPrice;

    if (minPrice !== null && maxPrice !== null && minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
       throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    return this.prisma.savedSearch.update({
      where: { id },
      data: updateSavedSearchDto,
    });
  }

  async remove(id: string, buyerId: string) {
    await this.findOne(id, buyerId); // Checks existence and ownership

    return this.prisma.savedSearch.delete({
      where: { id },
    });
  }
}
