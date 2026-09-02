import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class SubmitKycDto {
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @IsString()
  @IsNotEmpty()
  businessAddress: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  companyNumber?: string;
}
