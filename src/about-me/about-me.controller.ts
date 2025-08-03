import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AboutMeService } from './about-me.service';
import { UpdateAboutMeDto } from './dto/update-about-me.dto';

@Controller('about-me')
export class AboutMeController {
  constructor(private readonly aboutMeService: AboutMeService) {}

  @Get()
  findOne() {
    return this.aboutMeService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateAboutMeDto: UpdateAboutMeDto) {
    return this.aboutMeService.update(updateAboutMeDto);
  }
}
