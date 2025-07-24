import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AboutMeService } from './about-me.service';
// import { CreateAboutMeDto } from './dto/create-about-me.dto';
import { UpdateAboutMeDto } from './dto/update-about-me.dto';

@Controller('about-me')
export class AboutMeController {
  constructor(private readonly aboutMeService: AboutMeService) {}

  @Get()
  findOne() {
    return this.aboutMeService.findOne();
  }

  @Patch()
  update(@Body() updateAboutMeDto: UpdateAboutMeDto) {
    return this.aboutMeService.update(updateAboutMeDto);
  }
}
