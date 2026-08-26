import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaType } from '../../../generated/prisma/client.js';

export class AddListingMediaDto {
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;
}
