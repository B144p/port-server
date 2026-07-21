import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppService', () => {
  let appService: AppService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('reports ok when the database responds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await appService.healthCheck();

    expect(result.status).toBe('ok');
    expect(result.db).toBe('ok');
  });

  it('reports degraded when the database query throws', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

    const result = await appService.healthCheck();

    expect(result.status).toBe('degraded');
    expect(result.db).toBe('error');
  });
});
