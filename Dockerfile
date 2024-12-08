# Base stage
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS prod-deps
COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml
# below run command giving error while building image on railway
# RUN --mount=type=cache,id=s/passman-/pnpm/store,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm install --prod  --frozen-lockfile

# Build stage
FROM base AS build
COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml
# below run command giving error while building image on railway
# RUN --mount=type=cache,id=s/passman-/pnpm/store,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm install  --frozen-lockfile

COPY . /app/
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=build /app/dist dist

COPY package.json .
COPY drizzle.config.ts .

EXPOSE 3000
CMD [ "npm" , "start" ]
