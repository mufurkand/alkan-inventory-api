import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

class FiltersDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly materialType: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly channel: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly caseType: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly voltage: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly current: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly value: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly unit: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly power: string[];
}

export class SearchFiltersDto {
  @IsString()
  @IsOptional()
  readonly search: string;

  @ValidateNested()
  @Type(() => FiltersDto)
  @IsOptional()
  readonly filters: FiltersDto;
}
