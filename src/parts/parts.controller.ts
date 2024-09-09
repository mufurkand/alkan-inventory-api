import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import * as path from 'path';
import { ImageExceptionFilter } from './filters/image-exception.filter';
import { IdDto } from './dto/id.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchFiltersDto } from './dto/search-filters.dto';
import { SearchDto } from './dto/search.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('excel', {
      storage: memoryStorage(),
    }),
  )
  upload(@UploadedFile() excel: Express.Multer.File) {
    return this.partsService.upload(excel ? excel.buffer : null);
  }

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @UseFilters(ImageExceptionFilter)
  create(
    @Body()
    createPartDto: CreatePartDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.partsService.create(createPartDto, image ? image.path : null);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.partsService.findAll(paginationDto);
  }

  @Post('search')
  search(
    @Query() paginationDto: PaginationDto,
    @Body() searchFiltersDto: SearchFiltersDto,
  ) {
    return this.partsService.search(paginationDto, searchFiltersDto);
  }

  @Get('filters')
  filters(@Query() { search }: SearchDto) {
    return this.partsService.filters(search);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('download')
  download(@Res() res: Response) {
    return this.partsService.download(res);
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.partsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @UseFilters(ImageExceptionFilter)
  update(
    @Param() { id }: IdDto,
    @Body()
    updatePartDto: UpdatePartDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.partsService.update(
      id,
      updatePartDto,
      image ? image.path : null,
    );
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete()
  removeAll() {
    return this.partsService.removeAll();
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.partsService.remove(id);
  }
}
