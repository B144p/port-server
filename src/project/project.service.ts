import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    const { tags, sources, ...restPayload } = createProjectDto;
    return this.prisma.project.create({
      data: {
        ...restPayload,
        tags: tags?.length
          ? { create: tags.map((tag) => ({ tag })) }
          : undefined,
        sources: sources?.length ? { create: sources } : undefined,
      },
      include: { tags: true, sources: true },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      include: { tags: true, sources: true },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { tags: true, sources: true },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const existingData = await this.findOne(id);
    if (!existingData) throw new NotFoundException('Data not found!');

    const { tags, sources, ...restPayload } = updateProjectDto;

    if (tags) {
      await this.prisma.projectTag.deleteMany({
        where: { projectId: id },
      });
    }
    if (sources) {
      await this.prisma.projectSource.deleteMany({
        where: { projectId: id },
      });
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...restPayload,
        tags: tags?.length
          ? { create: tags.map((tag) => ({ tag })) }
          : undefined,
        sources: sources?.length ? { create: sources } : undefined,
      },
      include: { tags: true, sources: true },
    });
  }

  async remove(id: string) {
    await this.prisma.project.delete({
      where: { id },
    });
    return `This action removes a #${id} project`;
  }
}
