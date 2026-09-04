import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedSearchDto } from './create-saved-search.dto.js';

export class UpdateSavedSearchDto extends PartialType(CreateSavedSearchDto) {}
