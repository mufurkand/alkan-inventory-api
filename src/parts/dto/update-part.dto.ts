import { PartialType } from '@nestjs/mapped-types';
import { CreatePartDto } from './create-part.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePartDto extends PartialType(CreatePartDto) {
  @IsString()
  @IsOptional()
  // { updateImage: false }
  readonly updateImageJson: string;
}
