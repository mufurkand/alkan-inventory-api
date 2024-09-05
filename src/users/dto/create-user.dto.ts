import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMIN', 'USER'])
  readonly role: 'ADMIN' | 'USER';

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
