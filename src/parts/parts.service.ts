import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPartDto: CreatePartDto) {
    // await statement is in the database service already
    console.log(typeof createPartDto);
    return this.databaseService.part.create({ data: createPartDto });
  }

  async findAll() {
    return this.databaseService.part.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.part.findUnique({ where: { id } });
  }

  async update(id: number, updatePartDto: UpdatePartDto) {
    return this.databaseService.part.update({
      where: { id },
      data: updatePartDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.part.delete({ where: { id } });
  }
}
