# Base stage
FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR  /app
COPY . /app

FROM base AS prod-deps
RUN --mount=type=cache,id=s/passman-/pnpm/store,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=base /app /app
RUN --mount=type=cache,id=s/passman-/pnpm/store,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
# EXPOSE 3000
CMD [ "pnpm" , "start" ]
