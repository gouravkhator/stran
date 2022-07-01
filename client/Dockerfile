ARG NODE_ENV

FROM node:16.8.0-alpine AS base

WORKDIR /usr/src/client

COPY ./package*.json ./

FROM base AS client-development
RUN npm install
COPY ./ ./
ENTRYPOINT [ "npm", "run", "dev"]

FROM base AS client-production
RUN npm install --production
COPY ./ ./
ENTRYPOINT [ "npm", "run", "serve"]

FROM client-${NODE_ENV} AS client
EXPOSE $CLIENT_PORT
