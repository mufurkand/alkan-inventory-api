import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS, USER_OMIT_QUERY } from 'src/lib/constants/constants';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_OR_ROUNDS,
    );
    return this.databaseService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      ...USER_OMIT_QUERY,
    });
  }

  findAll() {
    return this.databaseService.user.findMany({
      ...USER_OMIT_QUERY,
    });
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id,
      },
      ...USER_OMIT_QUERY,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      ...USER_OMIT_QUERY,
    });
  }

  removeAll() {
    return this.databaseService.user.deleteMany({});
  }

  remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
      ...USER_OMIT_QUERY,
    });
  }
}
