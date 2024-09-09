import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @IsString()
  @IsOptional()
  readonly search: string;
}
