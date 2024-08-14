import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  materialType: string;

  @IsString()
  @IsNotEmpty()
  partNumber: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  channel: string;

  @IsString()
  @IsOptional()
  caseType: string;

  @IsString()
  @IsOptional()
  voltage: string;

  @IsString()
  @IsOptional()
  current: string;

  @IsString()
  @IsOptional()
  value: string;

  @IsString()
  @IsOptional()
  unit: string;

  @IsString()
  @IsOptional()
  power: string;

  @IsString()
  @IsOptional()
  description: string;
}
