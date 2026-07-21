import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFrontendVersionDto } from './dto/create-frontend-version.dto';
import { UpdateFrontendVersionDto } from './dto/update-frontend-version.dto';

@Injectable()
export class FrontendVersionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createFrontendVersionDto: CreateFrontendVersionDto) {
    return this.prisma.frontendVersion.create({
      data: createFrontendVersionDto,
    });
  }

  async list(includeHidden: boolean) {
    const [versions, aggregate] = await Promise.all([
      this.prisma.frontendVersion.findMany({
        where: includeHidden ? undefined : { show: true },
        orderBy: { order: 'asc' },
      }),
      // totalViews sums ALL versions, including hidden ones — it's a
      // traffic figure, not a display figure, so `show` doesn't gate it.
      this.prisma.frontendVersion.aggregate({ _sum: { views: true } }),
    ]);

    return {
      totalViews: aggregate._sum.views ?? 0,
      versions,
    };
  }

  async update(id: string, updateFrontendVersionDto: UpdateFrontendVersionDto) {
    const existingData = await this.prisma.frontendVersion.findUnique({
      where: { id },
    });
    if (!existingData) throw new NotFoundException('Data not found!');

    return this.prisma.frontendVersion.update({
      where: { id },
      data: updateFrontendVersionDto,
    });
  }

  async remove(id: string) {
    const existingData = await this.prisma.frontendVersion.findUnique({
      where: { id },
    });
    if (!existingData) throw new NotFoundException('Data not found!');

    await this.prisma.frontendVersion.delete({ where: { id } });
    return `This action removes a #${id} frontend version`;
  }
}
