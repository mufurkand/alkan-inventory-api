import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { SearchDto } from './dto/search.dto';
import { Request } from 'express';

// TODO: create a dto for id

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard, AdminGuard)
  // for formdata without files because
  // FIXME: I can not get JSON to work
  @UseInterceptors(NoFilesInterceptor())
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // TODO: add search dto
  // FIXME: I can not get JSON to work
  @UseGuards(JwtGuard, AdminGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('search')
  search(@Body() searchDto: SearchDto) {
    return this.usersService.search(searchDto.search);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete()
  removeAll() {
    return this.usersService.removeAll();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
