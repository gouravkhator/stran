ARG NODE_ENV

FROM node:16.8.0-alpine AS base

WORKDIR /usr/src/server

COPY ./package*.json ./

FROM base AS server-development
RUN npm install
COPY ./ ./
ENTRYPOINT [ "npm", "run", "dev"]

FROM base AS server-production
RUN npm install --production
COPY ./ ./
ENTRYPOINT [ "npm", "start"]

FROM server-${NODE_ENV} AS server
EXPOSE $SERVER_PORT
