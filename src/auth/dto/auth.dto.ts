import { IsNotEmpty, IsString } from 'class-validator';

export class AuthPayloadDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
