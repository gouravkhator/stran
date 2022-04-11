#!/bin/sh

# Change to the correct directory
cd /usr/src/blockchain;

# Run hardhat
npm run localnode;

# Keep node alive
set -e
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi
exec "$@"
