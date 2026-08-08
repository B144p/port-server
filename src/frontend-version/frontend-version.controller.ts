import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateFrontendVersionDto } from './dto/create-frontend-version.dto';
import { UpdateFrontendVersionDto } from './dto/update-frontend-version.dto';
import { FrontendVersionService } from './frontend-version.service';

@Controller('frontend-version')
export class FrontendVersionController {
  constructor(
    private readonly frontendVersionService: FrontendVersionService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateFrontendVersionDto })
  create(@Body() createFrontendVersionDto: CreateFrontendVersionDto) {
    return this.frontendVersionService.create(createFrontendVersionDto);
  }

  @Get()
  findAll() {
    return this.frontendVersionService.list(false);
  }

  // Separate route (not a `?all=true` query flag) so hidden versions are
  // never reachable without the guard — a query param can't be relied on
  // to gate visibility on its own.
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAllForAdmin() {
    return this.frontendVersionService.list(true);
  }

  // Declared before `:id` — otherwise Nest would match "view-events" as an
  // id on the routes below.
  @Delete('view-events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'olderThanDays', required: false, example: 90 })
  pruneViewEvents(@Query('olderThanDays') olderThanDays?: string) {
    return this.frontendVersionService.pruneViewEvents(
      olderThanDays ? Number(olderThanDays) : 90,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateFrontendVersionDto })
  update(
    @Param('id') id: string,
    @Body() updateFrontendVersionDto: UpdateFrontendVersionDto,
  ) {
    return this.frontendVersionService.update(id, updateFrontendVersionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.frontendVersionService.remove(id);
  }
}
