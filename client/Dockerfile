ARG NODE_ENV

FROM node:alpine AS base

WORKDIR /usr/src/client

COPY ./package*.json ./

FROM base AS client-development
RUN npm install
COPY ./ ./
CMD [ "npm", "run", "dev"]

FROM base AS client-production
RUN npm install --production
COPY ./ ./
CMD [ "npm", "run", "serve"]

FROM client-${NODE_ENV} AS client
EXPOSE 3000
