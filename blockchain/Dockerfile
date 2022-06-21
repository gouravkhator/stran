ARG NODE_ENV

FROM node:alpine AS base

WORKDIR /usr/src/blockchain

COPY ./package*.json ./

FROM base AS blockchain-development
RUN npm install
COPY ./ ./
RUN npm run localnode
RUN until wget -O- http://localhost:8545/; do \
    sleep 1; \
  done && BLOCKCHAIN_HOST=blockchain npm run deploy

# COPY $PWD/docker.entrypoint.sh /usr/local/bin
# ENTRYPOINT ["/bin/sh", "cat /usr/local/bin/docker.entrypoint.sh"]

# uncomment below code, after we confirm the development stage commands

# FROM base AS blockchain-production
# RUN npm install --production
# COPY ./ ./
# COPY $PWD/docker.entrypoint.sh /usr/local/bin
# ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker.entrypoint.sh"]

FROM blockchain-${NODE_ENV} AS blockchain
EXPOSE 8545

# refer this article for more info on healthcheck: 
# https://docs.docker.com/engine/reference/builder/#healthcheck
# HEALTHCHECK --interval=5m CMD curl -f http://localhost:8545 || exit 1
