const { connectBlockchain } = require("../services/blockchain-init.service");
const { getRedisClient } = require("../services/redis.service");

/**
 * Middleware for making necessary connections like to blockchain and redis on every request..
 * 
 * TODO: We can modify this middleware to only run once within 30 mins at the server end.
 */
async function makeImpConnectionsMiddleware(req, res, next) {
  try {
    await connectBlockchain(); // connect to blockchain
    await getRedisClient(); // connect to the redis service
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  makeImpConnectionsMiddleware,
};
