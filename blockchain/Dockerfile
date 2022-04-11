ARG NODE_ENV

FROM node:alpine AS base

WORKDIR /usr/src/blockchain

COPY ./package*.json ./

FROM base AS blockchain-development
RUN npm install
COPY ./ ./
COPY $PWD/docker.entrypoint.sh /usr/local/bin
ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker.entrypoint.sh"]

FROM base AS blockchain-production
RUN npm install --production
COPY ./ ./
COPY $PWD/docker.entrypoint.sh /usr/local/bin
ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker.entrypoint.sh"]

FROM blockchain-${NODE_ENV} AS blockchain
EXPOSE 8545
