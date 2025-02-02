# Base stage
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
LABEL org.opencontainers.image.source=https://github.com/Nizam-Chaudhary/passman-be
RUN corepack enable
WORKDIR /app

# Install prod dependencies
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Main build
FROM base

# copy required files
COPY package.json .
COPY drizzle.config.ts .
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=build /app/dist dist

# start server
EXPOSE 3000
CMD [ "pnpm" , "start" ]
