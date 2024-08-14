import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartsService {
  create(createPartDto: Prisma.PartCreateInput) {
    return 'This action adds a new part';
  }

  findAll() {
    return `This action returns all parts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} part`;
  }

  update(id: number, updatePartDto: Prisma.PartUpdateInput) {
    return `This action updates a #${id} part`;
  }

  remove(id: number) {
    return `This action removes a #${id} part`;
  }
}
