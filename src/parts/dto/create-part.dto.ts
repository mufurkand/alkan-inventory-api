import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  readonly materialType: string;

  @IsString()
  @IsNotEmpty()
  readonly partNumber: string;

  @IsString()
  @IsOptional()
  readonly location: string;

  @IsString()
  @IsOptional()
  readonly price: string;

  @IsString()
  @IsOptional()
  readonly quantity: string;

  @IsString()
  @IsOptional()
  readonly channel: string;

  @IsString()
  @IsOptional()
  readonly caseType: string;

  @IsString()
  @IsOptional()
  readonly voltage: string;

  @IsString()
  @IsOptional()
  readonly current: string;

  @IsString()
  @IsOptional()
  readonly value: string;

  @IsString()
  @IsOptional()
  readonly unit: string;

  @IsString()
  @IsOptional()
  readonly power: string;

  @IsString()
  @IsOptional()
  readonly description: string;
}
