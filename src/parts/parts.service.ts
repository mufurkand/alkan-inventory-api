import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import * as fs from 'fs';
import { PaginationDto } from './dto/pagination.dto';
import {
  BATCH_SIZE,
  DEFAULT_PAGE_SIZE,
} from 'src/common/constants/common.constants';
import { SearchFiltersDto } from './dto/search-filters.dto';
import * as xlsx from 'xlsx';
import { Response } from 'express';

@Injectable()
export class PartsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // TODO: write a constructSearchQuery function

  async create(createPartDto: CreatePartDto, imagePath: string | null) {
    // await statement is in the database service already
    return this.databaseService.part.create({
      data: { ...createPartDto, imagePath },
    });
  }

  // TODO: see if I can create records without having to save the file
  async upload(excelBuffer: Buffer | null) {
    // import the excel file and save the data to the database
    if (!excelBuffer) {
      throw new Error('Invalid file path');
    }

    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: null, raw: false });

    try {
      const transactionPromises = [];

      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        transactionPromises.push(
          this.databaseService.$transaction([
            this.databaseService.part.createMany({
              data: batch as CreatePartDto[],
              skipDuplicates: true,
            }),
          ]),
        );
      }

      await Promise.all(transactionPromises);
    } catch (error) {
      console.error('Error importing data:', error);
    }
    return true;
  }

  async download(res: Response) {
    let offset = 0;
    let parts = [];
    const worksheet = xlsx.utils.json_to_sheet([]);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Parts');

    let isFirstRun = true;

    do {
      parts = await this.databaseService.part.findMany({
        skip: offset,
        take: BATCH_SIZE,
        omit: {
          id: true,
          imagePath: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (parts.length > 0) {
        xlsx.utils.sheet_add_json(worksheet, parts, {
          skipHeader: !isFirstRun,
          origin: isFirstRun ? 'A1' : -1,
        });
        offset += BATCH_SIZE;
        isFirstRun = false;
      }
    } while (parts.length === BATCH_SIZE);

    const excelBuffer = xlsx.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader('Content-Disposition', 'attachment; filename=parts.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.send(excelBuffer);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = DEFAULT_PAGE_SIZE.PART, offset = 0 } = paginationDto;
    let nextPage: number | boolean = offset + limit;
    let prevPage: number | boolean = offset - limit;

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

    if (offset === 0) prevPage = false;
    else if (prevPage < 0) prevPage = 0;

    return { data, nextPage, prevPage };
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

    const { updateImageJson, ...updateData } = updatePartDto;
    const { updateImage } = JSON.parse(updateImageJson);

    // Check if the current part has an imagePath and delete the previous image if updateImage is
    // true
    if (currentPart?.imagePath && updateImage) {
      fs.unlink(currentPart.imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        }
      });
    }

    if (typeof updateImage !== 'boolean') {
      throw new Error('Invalid image update value');
    }

    if (updateImage === false && imagePath !== null) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        }
      });
    }

    // Update the part with the new details
    return this.databaseService.part.update({
      where: { id },
      data: {
        ...updateData,
        imagePath: updateImage
          ? imagePath
          : currentPart?.imagePath === undefined
            ? null
            : currentPart.imagePath,
      },
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

  async search(
    paginationDto: PaginationDto,
    searchFiltersDto: SearchFiltersDto,
  ) {
    const { limit = DEFAULT_PAGE_SIZE.PART, offset = 0 } = paginationDto;
    let nextPage: number | boolean = offset + limit;
    let prevPage: number | boolean = offset - limit;

    const { search, filters } = searchFiltersDto;

    let filterQuery = {};
    let searchQuery = {};

    if (filters)
      filterQuery = {
        materialType: { in: filters.materialType },
        channel: { in: filters.channel },
        caseType: { in: filters.caseType },
        voltage: { in: filters.voltage },
        current: { in: filters.current },
        value: { in: filters.value },
        unit: { in: filters.unit },
        power: { in: filters.power },
      };

    if (search)
      searchQuery = {
        OR: [
          { partNumber: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };

    // Fetch limit + 1 items to check if next page exists
    const data = await this.databaseService.part.findMany({
      skip: offset,
      take: limit + 1,
      where: {
        ...searchQuery,
        ...filterQuery,
      },
    });

    // Determine if there is a next page
    if (data.length > limit) {
      data.pop(); // Remove the extra item
    } else {
      nextPage = false;
    }

    if (offset === 0) prevPage = false;
    else if (prevPage < 0) prevPage = 0;

    return { data, nextPage, prevPage };
  }

  // TODO: come up with a better idea
  // please end my suffering
  async filters(search: string) {
    let query = {};
    if (search)
      query = {
        where: {
          OR: [
            { partNumber: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      };

    const materialType = await this.databaseService.part.findMany({
      distinct: ['materialType'],
      select: { materialType: true },
      ...query,
    });

    const channel = await this.databaseService.part.findMany({
      distinct: ['channel'],
      select: { channel: true },
      ...query,
    });

    const caseType = await this.databaseService.part.findMany({
      distinct: ['caseType'],
      select: { caseType: true },
      ...query,
    });

    const voltage = await this.databaseService.part.findMany({
      distinct: ['voltage'],
      select: { voltage: true },
      ...query,
    });

    const current = await this.databaseService.part.findMany({
      distinct: ['current'],
      select: { current: true },
      ...query,
    });

    const value = await this.databaseService.part.findMany({
      distinct: ['value'],
      select: { value: true },
      ...query,
    });

    const unit = await this.databaseService.part.findMany({
      distinct: ['unit'],
      select: { unit: true },
      ...query,
    });

    const power = await this.databaseService.part.findMany({
      distinct: ['power'],
      select: { power: true },
      ...query,
    });

    return {
      materialType: materialType.map((item) => item.materialType),
      channel: channel.map((item) => item.channel),
      caseType: caseType.map((item) => item.caseType),
      voltage: voltage.map((item) => item.voltage),
      current: current.map((item) => item.current),
      value: value.map((item) => item.value),
      unit: unit.map((item) => item.unit),
      power: power.map((item) => item.power),
    };
  }
}
