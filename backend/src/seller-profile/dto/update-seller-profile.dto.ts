import { IsString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class UpdateSellerProfileDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  sellerType?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  yearsOfExperience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCategories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocations?: string[];
}
