import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class ReorderListingMediaDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  mediaIds: string[];
}
