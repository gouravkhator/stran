#!/bin/sh

# Change to the correct directory
cd /usr/src/blockchain;

# Run hardhat
npm run localnode;

# Keep node alive
set -e

until wget -O- http://localhost:8545/ || exit 1; do
  sleep 1
done

npm run deploy;

# if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
#   set -- node "$@"
# fi
# exec "$@"
