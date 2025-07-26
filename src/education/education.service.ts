import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEducationDto: CreateEducationDto) {
    const { title, start_date, end_date, descriptions } = createEducationDto;
    await this.prisma.education.create({
      data: {
        title,
        startDate: start_date,
        endDate: end_date ?? null,
        descriptions: descriptions?.length
          ? { create: descriptions.map((desc) => ({ description: desc })) }
          : undefined,
      },
      include: { descriptions: true },
    });
    return createEducationDto;
  }

  findAll() {
    return this.prisma.education.findMany({
      include: { descriptions: true },
      orderBy: { startDate: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.education.findUnique({
      where: { id },
      include: { descriptions: true },
    });
  }

  async update(id: string, updateEducationDto: UpdateEducationDto) {
    const existingData = await this.prisma.education.findUnique({
      where: { id },
      include: { descriptions: true },
    });

    if (!existingData) throw new NotFoundException('Data not found!');

    const { title, start_date, end_date, descriptions } = updateEducationDto;

    // delete before add new description
    if (descriptions) {
      await this.prisma.educationDescription.deleteMany({
        where: { educationId: id },
      });
    }

    return this.prisma.education.update({
      where: { id },
      data: {
        title,
        startDate: start_date,
        endDate: end_date,
        descriptions: descriptions?.length
          ? { create: descriptions.map((desc) => ({ description: desc })) }
          : undefined,
      },
      include: { descriptions: true },
    });
  }

  async remove(id: string) {
    await this.prisma.education.delete({
      where: { id },
    });
    return `This action removes a #${id} education`;
  }
}
