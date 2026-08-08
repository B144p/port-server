# Portfolio Server

I build this backend server just because I have serveral version of frontend, And restart NestJS knowledge.

## 🛠️ Prerequisites

- Node.js v20+
- pnpm
- Docker & Docker Compose

## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/) (TypeScript)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Authentication:** JWT (Passport.js)
- **Containerization:** Docker, docker-compose

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Port for the NestJS server (default: 3000)
- `POSTGRES_PORT` - Port for PostgreSQL in Docker (default: 5432)
- `SWAGGER_ENABLED` - Enable Swagger docs (`true`/`false`)
- `SWAGGER_PATH` - Path for Swagger UI (default: `swagger`)
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` - Credentials for initial superuser (used in seeding)
- `TRUST_PROXY_HOPS` - Number of proxy hops in front of the app (default: `1`, matches Render)
- `CORS_FALLBACK_ORIGINS` - Comma-separated origins to allow if the CORS DB lookup fails
- `VIEW_DEDUPE_WINDOW_HOURS` - Dedupe window for view counting (default: `2`)

## TODO

- **Automated ViewEvent retention.** `ViewEvent` stores a raw client IP per
  row, which is personal data. `DELETE /v1/frontend-version/view-events?olderThanDays=90`
  exists for manual pruning, but nothing calls it on a schedule yet. Wire up
  one of: `@nestjs/schedule` cron, a GitHub Actions workflow hitting the
  endpoint (this repo already used Actions for a keep-alive job before
  switching to UptimeRobot), or an external scheduled ping.

## 🐳 Start with Docker

**Build and start the containers:**

```bash
docker-compose up -d --build
```

**Run migrations:**

```bash
pnpm dlx prisma migrate deploy
```

**Generate Prisma client:**

```bash
pnpm dlx prisma generate
```

**Seed database:**

```bash
pnpm run db:seed
```
