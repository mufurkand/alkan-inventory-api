import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import * as fs from 'fs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/common/constants/common.constants';

@Injectable()
export class PartsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPartDto: CreatePartDto, imagePath: string | null) {
    // await statement is in the database service already
    return this.databaseService.part.create({
      data: { ...createPartDto, imagePath },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = DEFAULT_PAGE_SIZE.PART, offset = 0 } = paginationDto;
    let nextPage: number | boolean = offset + limit;
    let previousPage: number | boolean = offset - limit;

    // Fetch limit + 1 items to check if next page exists
    const data = await this.databaseService.part.findMany({
      skip: offset,
      take: limit + 1,
    });

    // Determine if there is a next page
    if (data.length > limit) {
      data.pop(); // Remove the extra item
    } else {
      nextPage = false;
    }

    if (offset === 0) previousPage = false;
    else if (previousPage < 0) previousPage = 0;

    return { data, nextPage, previousPage };
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
