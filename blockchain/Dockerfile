ARG NODE_ENV

FROM node:16.8.0-alpine AS base
WORKDIR /usr/src/blockchain
COPY ./package*.json ./

FROM base AS blockchain-development
RUN npm install

FROM base AS blockchain-production
RUN npm install --production

FROM blockchain-${NODE_ENV} AS blockchain
# COPY $PWD/docker.entrypoint.sh /usr/local/bin
COPY . ./
EXPOSE $BLOCKCHAIN_PORT
# ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker.entrypoint.sh"]
ENTRYPOINT ["/bin/sh", "/usr/src/blockchain/docker.entrypoint.sh"]
