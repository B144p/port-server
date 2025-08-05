# ---------------- Base node image ----------------
FROM node:20-alpine AS base
RUN npm i -g pnpm

# ---------------- Dependencies stage ----------------
FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# ---------------- Build stage ----------------
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm dlx prisma generate
RUN pnpm build

# delete unnecessary package
RUN pnpm prune --prod

# ---------------- Final deploy image ----------------
FROM base AS deploy
WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/src/main.js" ]
