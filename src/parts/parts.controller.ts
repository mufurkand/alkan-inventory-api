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
} from '@nestjs/common';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ImageExceptionFilter } from './filters/image-exception.filter';
import { IdDto } from 'src/common/dto/id.dto';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

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
  findAll() {
    return this.partsService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.partsService.findOne(id);
  }

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

  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.partsService.remove(id);
  }
}
