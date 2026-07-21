import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  // Shifts every row between currentOrder and the clamped target to make
  // room, and returns the clamped target — it does NOT write the moving
  // row's own order, so callers combine it with their own update. `order`
  // is deliberately not @unique (see migration note): a non-deferrable
  // unique index can transiently reject a batch shift even when the final
  // state is valid, depending on physical row order. The invariant is
  // enforced here instead, which is safe for a single-admin, low-write table.
  private async shiftForOrder(
    tx: Prisma.TransactionClient,
    currentOrder: number,
    targetOrderRaw: number,
  ) {
    const count = await tx.project.count();
    const targetOrder = this.clamp(targetOrderRaw, 0, count - 1);
    if (targetOrder === currentOrder) return targetOrder;

    if (targetOrder < currentOrder) {
      // Moving toward 0: [target, current) slides down one slot.
      await tx.project.updateMany({
        where: { order: { gte: targetOrder, lt: currentOrder } },
        data: { order: { increment: 1 } },
      });
    } else {
      // Moving away from 0: (current, target] slides up one slot.
      await tx.project.updateMany({
        where: { order: { gt: currentOrder, lte: targetOrder } },
        data: { order: { decrement: 1 } },
      });
    }

    return targetOrder;
  }

  create(createProjectDto: CreateProjectDto) {
    const { tags, sources, order, ...restPayload } = createProjectDto;

    return this.prisma.$transaction(async (tx) => {
      const count = await tx.project.count();
      // Upper clamp is `count`, not `count - 1` — that's what allows
      // appending when order is omitted.
      const target = this.clamp(order ?? count, 0, count);

      await tx.project.updateMany({
        where: { order: { gte: target } },
        data: { order: { increment: 1 } },
      });

      return tx.project.create({
        data: {
          ...restPayload,
          order: target,
          tags: tags?.length
            ? { create: tags.map((tag) => ({ tag })) }
            : undefined,
          sources: sources?.length ? { create: sources } : undefined,
        },
        include: { tags: true, sources: true },
      });
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { tags: true, sources: true },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { tags: true, sources: true },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    const { tags, sources, order, ...restPayload } = updateProjectDto;

    return this.prisma.$transaction(async (tx) => {
      const existingData = await tx.project.findUnique({ where: { id } });
      if (!existingData) throw new NotFoundException('Data not found!');

      if (tags) {
        await tx.projectTag.deleteMany({ where: { projectId: id } });
      }
      if (sources) {
        await tx.projectSource.deleteMany({ where: { projectId: id } });
      }

      const targetOrder =
        order !== undefined
          ? await this.shiftForOrder(tx, existingData.order, order)
          : undefined;

      return tx.project.update({
        where: { id },
        data: {
          ...restPayload,
          order: targetOrder,
          tags: tags?.length
            ? { create: tags.map((tag) => ({ tag })) }
            : undefined,
          sources: sources?.length ? { create: sources } : undefined,
        },
        include: { tags: true, sources: true },
      });
    });
  }

  reorder(id: string, order: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingData = await tx.project.findUnique({ where: { id } });
      if (!existingData) throw new NotFoundException('Data not found!');

      const targetOrder = await this.shiftForOrder(
        tx,
        existingData.order,
        order,
      );

      return tx.project.update({
        where: { id },
        data: { order: targetOrder },
        include: { tags: true, sources: true },
      });
    });
  }

  remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const existingData = await tx.project.findUnique({
        where: { id },
        select: { order: true },
      });
      if (!existingData) throw new NotFoundException('Data not found!');

      await tx.project.delete({ where: { id } });
      await tx.project.updateMany({
        where: { order: { gt: existingData.order } },
        data: { order: { decrement: 1 } },
      });

      return `This action removes a #${id} project`;
    });
  }
}
