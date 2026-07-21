import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { SKIP_VIEW_COUNT_KEY } from './skip-view-count.decorator';
import { ViewService } from './view.service';

// Routes that can never be a "page view" even if they happen to carry a
// version identifier — health checks, auth, and the swagger docs.
const DENYLIST_PREFIXES = [
  '/health',
  '/v1/auth',
  `/${process.env.SWAGGER_PATH ?? 'swagger'}`,
];

@Injectable()
export class ViewInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ViewInterceptor.name);

  constructor(
    private readonly viewService: ViewService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    // Cheapest checks first — this covers the dominant case (all admin
    // traffic, all crawlers) with a single header lookup.
    const key =
      (request.headers['x-frontend-version'] as string | undefined) ??
      (request.query.version_id as string | undefined);
    if (!key) return next.handle();
    if (request.method !== 'GET') return next.handle();
    // The admin panel always sends this; visitors never do — one check
    // covers every JWT-guarded route without needing the Reflector.
    if (request.headers.authorization) return next.handle();
    if (DENYLIST_PREFIXES.some((prefix) => request.path.startsWith(prefix)))
      return next.handle();
    if (
      this.reflector.getAllAndOverride<boolean>(SKIP_VIEW_COUNT_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return next.handle();

    return next.handle().pipe(
      tap({
        // Only a successful response counts as a view (a 404 doesn't).
        // Deliberately not awaited and not merged into the response
        // stream: a DB error here must never turn an already-successful
        // request into a 500, and the write must never add latency.
        next: () => {
          void this.viewService
            .record({
              key,
              ip: request.ip ?? '',
              userAgent: request.headers['user-agent'],
              referer: request.headers['referer'],
              path: request.path,
              acceptLanguage: request.headers['accept-language'],
            })
            .catch((error: unknown) => this.logger.debug(error));
        },
      }),
    );
  }
}
