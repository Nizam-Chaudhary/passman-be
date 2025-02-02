# Base stage
FROM node:22-slim AS base
LABEL org.opencontainers.image.source=https://github.com/Nizam-Chaudhary/passman-be
WORKDIR /app

# Install prod dependencies
FROM base AS prod-deps
COPY package.json yarn.lock ./
RUN yarn install --prod

# Build stage
FROM base AS build
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

# Main build
FROM base

# copy required files
COPY package.json .
COPY drizzle.config.ts .
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=build /app/dist dist

# start server
EXPOSE 3000
CMD [ "yarn" , "start" ]
