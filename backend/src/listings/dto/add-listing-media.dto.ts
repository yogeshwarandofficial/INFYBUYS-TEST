import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaType } from '@prisma/client';

export class AddListingMediaDto {
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;
}
