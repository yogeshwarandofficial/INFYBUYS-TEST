import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateEnquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  messageText: string;
}
