import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  readonly materialType: string;

  @IsString()
  @IsNotEmpty()
  readonly partNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @IsNumber()
  @IsOptional()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

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
