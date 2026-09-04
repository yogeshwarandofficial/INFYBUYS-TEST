import { IsString, IsOptional, IsEnum, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType } from '../../../generated/prisma/client.js';

export class CreateSavedSearchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(ListingType)
  @IsOptional()
  listingType?: ListingType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  maxPrice?: number;
}
