import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAboutMeDto } from './dto/create-about-me.dto';
import { UpdateAboutMeDto } from './dto/update-about-me.dto';

@Injectable()
export class AboutMeService {
  constructor(private readonly prisma: PrismaService) {}

  findOne() {
    return this.prisma.aboutMe.findFirstOrThrow();
  }

  async create(createAboutMeDto: CreateAboutMeDto) {
    return this.prisma.aboutMe.create({
      data: createAboutMeDto,
    });
  }

  async update(updateAboutMeDto: UpdateAboutMeDto) {
    const existingData = await this.prisma.aboutMe.findFirst();

    if (existingData) {
      return this.prisma.aboutMe.update({
        where: { id: existingData.id },
        data: updateAboutMeDto,
      });
    }
    return this.create(updateAboutMeDto as CreateAboutMeDto);
  }
}
