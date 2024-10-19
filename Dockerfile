# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn build

# Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json .

RUN yarn install --production

COPY . .

COPY --from=build /app/dist ./dist

CMD [ "yarn", "start" ]
