import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const prisma = app.get(PrismaService);
  app.enableCors({
    origin: async (
      origin: string | undefined,
      callback: (err: Error | null, allow: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);
      const found = await prisma.corsOrigin.findFirst({
        where: { url: origin },
      });
      callback(null, !!found);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (process.env.SWAGGER_ENABLED === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API Docs: Portfolio-server')
      .setDescription('Portfolio-server => only Rest version')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      process.env.SWAGGER_PATH ?? 'swagger',
      app,
      swaggerDocument,
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
