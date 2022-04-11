ARG NODE_ENV

FROM node:alpine AS base

WORKDIR /usr/src/server

COPY ./package*.json ./

FROM base AS server-development
RUN npm install
COPY ./ ./
CMD [ "npm", "run", "dev"]

FROM base AS server-production
RUN npm install --production
COPY ./ ./
CMD [ "npm", "start"]

FROM server-${NODE_ENV} AS server
EXPOSE 8081
