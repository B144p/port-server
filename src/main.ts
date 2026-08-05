import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

const CORS_CACHE_TTL_MS = 60_000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('v1', { exclude: ['health'] });

  // Express 5 defaults to the "simple" query parser, which cannot parse
  // bracketed array params like `?exclude[]=JSON`. "extended" (qs) can.
  app.set('query parser', 'extended');

  // Render terminates TLS one hop away. `1` trusts exactly that hop's
  // X-Forwarded-For entry; `true` would trust the whole (client-controlled)
  // chain and make req.ip trivially spoofable.
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1));

  // ===== TEMPORARY DEBUG — remove once TRUST_PROXY_HOPS is confirmed =====
  // Gated by its own flag rather than a dev/prod check: this needs to run
  // ON Render (where the real hop count actually matters), not only in
  // development — so "off by default, flip on where you need it" is the
  // right shape here, not "only in dev".
  // Toggle DEBUG_MODE=true in Render's env vars to turn logging on, delete
  // this whole block once TRUST_PROXY_HOPS is confirmed correct.
  if (process.env.DEBUG_MODE === 'true') {
    app.use((req: Request, _res: Response, next: NextFunction) => {
      const rawHeader = req.headers['x-forwarded-for'];
      const raw = Array.isArray(rawHeader) ? rawHeader.join(', ') : rawHeader;
      const hopCount = raw ? raw.split(',').length : 0;
      console.log(
        `[XFF-DEBUG] ${req.method} ${req.path} | raw X-Forwarded-For="${raw ?? '(none)'}" | hopCount=${hopCount} | resolved req.ip=${req.ip} | socket.remoteAddress=${req.socket.remoteAddress}`,
      );
      next();
    });
  }
  // ===== END TEMPORARY DEBUG =====

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const prisma = app.get(PrismaService);
  const fallbackOrigins = (process.env.CORS_FALLBACK_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const originCache = new Map<
    string,
    { allowed: boolean; expiresAt: number }
  >();

  const resolveOrigin = async (
    origin: string,
    callback: (err: Error | null, allow: boolean) => void,
  ) => {
    const cached = originCache.get(origin);
    if (cached && cached.expiresAt > Date.now()) {
      return callback(null, cached.allowed);
    }

    let allowed: boolean;
    try {
      // Intentionally ignores `show` — that field controls public listing
      // visibility only. Coupling it to CORS would mean toggling a version
      // hidden instantly breaks that frontend, which is a surprising and
      // unwanted side effect of an unrelated admin action.
      const found = await prisma.frontendVersion.findFirst({
        where: { url: origin },
      });
      allowed = !!found;
    } catch {
      // DB is unreachable — fall back to the static allowlist instead of
      // rejecting every cross-origin request.
      allowed = fallbackOrigins.includes(origin);
    }

    originCache.set(origin, {
      allowed,
      expiresAt: Date.now() + CORS_CACHE_TTL_MS,
    });
    callback(null, allowed);
  };

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin))
        return callback(null, true);
      void resolveOrigin(origin, callback);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Frontend-Version'],
    maxAge: 86400,
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
