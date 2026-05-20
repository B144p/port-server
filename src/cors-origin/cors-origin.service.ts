import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCorsOriginDto } from './dto/create-cors-origin.dto';

@Injectable()
export class CorsOriginService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCorsOriginDto) {
    return this.prisma.corsOrigin.create({ data: dto });
  }

  findAll() {
    return this.prisma.corsOrigin.findMany();
  }

  remove(id: string) {
    return this.prisma.corsOrigin.delete({ where: { id } });
  }
}
