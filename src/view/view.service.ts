import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface ViewContext {
  key: string;
  ip: string;
  userAgent?: string;
  referer?: string;
  path?: string;
  acceptLanguage?: string;
}

const KEY_CACHE_TTL_MS = 60_000;
const SEEN_CACHE_LIMIT = 10_000;

@Injectable()
export class ViewService {
  private readonly logger = new Logger(ViewService.name);

  // key -> resolved FrontendVersion.id (or null if unknown), TTL cached so
  // every request doesn't round-trip the DB just to resolve the header.
  private readonly keyCache = new Map<
    string,
    { id: string | null; expiresAt: number }
  >();

  // Process-local, best-effort dedupe: turns "6 API calls from one page
  // load" into one DB write instead of six no-op ones. It is NOT the
  // correctness mechanism — the DB unique constraint is — so it's safe to
  // clear on every bucket rollover and safe to be wrong across multiple
  // instances (Render may run more than one).
  private seen = new Set<string>();
  private seenBucket: number | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private windowMs() {
    const hours = Number(process.env.VIEW_DEDUPE_WINDOW_HOURS ?? 2);
    return hours * 3_600_000;
  }

  private normalizeIp(ip: string) {
    return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  }

  private async resolveVersionId(key: string): Promise<string | null> {
    const cached = this.keyCache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.id;

    const version = await this.prisma.frontendVersion.findUnique({
      where: { key },
      select: { id: true },
    });
    const id = version?.id ?? null;
    this.keyCache.set(key, { id, expiresAt: Date.now() + KEY_CACHE_TTL_MS });
    return id;
  }

  async record(ctx: ViewContext) {
    const versionId = await this.resolveVersionId(ctx.key);
    // Unknown/stale key (e.g. a frontend still sending a deleted version's
    // key) — ignore silently rather than error a request that already
    // succeeded.
    if (!versionId) return;

    const bucket = Math.floor(Date.now() / this.windowMs());
    if (this.seenBucket !== bucket) {
      this.seen = new Set();
      this.seenBucket = bucket;
    }

    const ip = this.normalizeIp(ctx.ip);
    const seenKey = `${versionId}|${ip}|${bucket}`;
    if (this.seen.has(seenKey)) return;
    if (this.seen.size < SEEN_CACHE_LIMIT) this.seen.add(seenKey);

    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.viewEvent.createMany({
        data: [
          {
            versionId,
            ip,
            bucket,
            userAgent: ctx.userAgent,
            referer: ctx.referer,
            path: ctx.path,
            acceptLanguage: ctx.acceptLanguage,
          },
        ],
        skipDuplicates: true,
      });

      // Only increment when this row was actually new — skipDuplicates
      // means a repeat within the same window silently no-ops instead of
      // throwing, which keeps `views` exactly equal to COUNT(ViewEvent).
      if (count === 1) {
        await tx.frontendVersion.update({
          where: { id: versionId },
          data: { views: { increment: 1 } },
        });
      }
    });
  }

  async pruneOlderThan(days: number) {
    const cutoff = new Date(Date.now() - days * 86_400_000);
    return this.prisma.viewEvent.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
  }
}
