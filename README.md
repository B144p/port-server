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
