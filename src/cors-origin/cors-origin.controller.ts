import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CorsOriginService } from './cors-origin.service';
import { CreateCorsOriginDto } from './dto/create-cors-origin.dto';

@Controller('cors-origin')
export class CorsOriginController {
  constructor(private readonly corsOriginService: CorsOriginService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateCorsOriginDto) {
    return this.corsOriginService.create(dto);
  }

  @Get()
  findAll() {
    return this.corsOriginService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.corsOriginService.remove(id);
  }
}
