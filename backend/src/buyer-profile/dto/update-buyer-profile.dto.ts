import { IsString, IsOptional, MaxLength, IsUrl, IsEnum, IsEmail, MinLength, ValidateIf } from 'class-validator';

export class UpdateBuyerProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @ValidateIf(o => o.fullName !== '')
  fullName?: string;

  @IsEmail()
  @IsOptional()
  @ValidateIf(o => o.email !== '')
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['Individual', 'Corporate', 'Private Equity', 'Search Fund'])
  buyerType?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @ValidateIf(o => o.website !== '')
  website?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @ValidateIf(o => o.linkedin !== '')
  linkedin?: string;
}
