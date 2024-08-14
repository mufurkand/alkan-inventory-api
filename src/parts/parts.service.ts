import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import * as fs from 'fs';

@Injectable()
export class PartsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPartDto: CreatePartDto, imagePath: string | null) {
    // await statement is in the database service already
    return this.databaseService.part.create({
      data: { ...createPartDto, imagePath },
    });
  }

  async findAll() {
    return this.databaseService.part.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.part.findUnique({ where: { id } });
  }

  async update(
    id: number,
    updatePartDto: UpdatePartDto,
    imagePath: string | null,
  ) {
    // Fetch the current part details
    const currentPart = await this.databaseService.part.findUnique({
      where: { id },
    });

    // Check if the current part has an imagePath and delete the previous image if a new one is provided
    if (currentPart?.imagePath && imagePath) {
      fs.unlink(currentPart.imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        }
      });
    }

    // Update the part with the new details
    return this.databaseService.part.update({
      where: { id },
      data: { ...updatePartDto, imagePath },
    });
  }

  async remove(id: number) {
    const currentPart = await this.databaseService.part.findUnique({
      where: { id },
    });

    if (currentPart?.imagePath) {
      fs.unlink(currentPart.imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        }
      });
    }

    return this.databaseService.part.delete({ where: { id } });
  }
}
