import { IsString, IsOptional } from 'class-validator';

export class SearchDto {
  @IsString()
  @IsOptional()
  readonly search: string;
}
