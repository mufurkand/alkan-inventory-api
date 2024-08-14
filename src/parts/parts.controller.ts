import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
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
import { ParseIntFieldsPipe } from './pipes/parse-int-fields.pipe';
import { ImageExceptionFilter } from './filters/image-exception.filter';

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
    @Body(
      new ParseIntFieldsPipe(['price', 'quantity']),
      new ValidationPipe({ whitelist: true }),
    )
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
  findOne(@Param('id') id: string) {
    return this.partsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) updatePartDto: UpdatePartDto,
  ) {
    return this.partsService.update(+id, updatePartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partsService.remove(+id);
  }
}
