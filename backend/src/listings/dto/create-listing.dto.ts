import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsBoolean, IsDateString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType } from '@prisma/client';

export class CreateListingDto {
  @IsEnum(ListingType)
  @IsNotEmpty()
  type: ListingType;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  priceOrRent: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  locationArea: string;

  @IsString()
  @IsNotEmpty()
  locationPostcode: string;

  @IsString()
  @IsOptional()
  locationExact?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  turnover?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  netProfit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  establishedYear?: number;

  @IsOptional()
  @IsBoolean()
  ndaRequired?: boolean;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
