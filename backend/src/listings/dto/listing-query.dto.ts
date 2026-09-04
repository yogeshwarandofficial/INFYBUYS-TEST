import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType, ListingStatus } from '../../../generated/prisma/client.js';

export class ListingQueryDto {
  @IsEnum(ListingType)
  @IsOptional()
  type?: ListingType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  locationArea?: string;

  @IsString()
  @IsOptional()
  locationPostcode?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minTurnover?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxTurnover?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minNetProfit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxNetProfit?: number;

  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsEnum(ListingType)
  @IsOptional()
  listingType?: ListingType;

  @IsString()
  @IsOptional()
  location?: string;
}
