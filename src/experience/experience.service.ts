import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  create(createExperienceDto: CreateExperienceDto) {
    const { responsibilities, ...restPayload } = createExperienceDto;
    return this.prisma.experience.create({
      data: {
        ...restPayload,
        responsibilities: responsibilities?.length
          ? { create: responsibilities.map((resp) => ({ description: resp })) }
          : undefined,
      },
      include: { responsibilities: true },
    });
  }

  findAll() {
    return this.prisma.experience.findMany({
      include: { responsibilities: true },
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(id: string) {
    return await this.prisma.experience.findUnique({
      where: { id },
      include: { responsibilities: true },
    });
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    const existingData = await this.findOne(id);
    if (!existingData) throw new NotFoundException('Data not found!');

    const { responsibilities, ...restPayload } = updateExperienceDto;

    if (responsibilities) {
      await this.prisma.experienceResponsibility.deleteMany({
        where: { experienceId: id },
      });
    }

    return this.prisma.experience.update({
      where: { id },
      data: {
        ...restPayload,
        responsibilities: responsibilities?.length
          ? { create: responsibilities.map((desc) => ({ description: desc })) }
          : undefined,
      },
      include: { responsibilities: true },
    });
  }

  async remove(id: string) {
    await this.prisma.experience.delete({
      where: { id },
    });
    return `This action removes a #${id} experience`;
  }
}
