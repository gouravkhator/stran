const redis = require("redis");
const { AppError } = require("../utils/errors.util");

// TODO: create child process for connecting with redis server

let client = null;

async function getRedisClient() {
  if (client !== null) {
    return client;
  } else {
    // process env values are all strings only, whether we declare in CLI args or in .env file
    let redisHost = process.env.REDIS_HOST || "localhost";
    let redisPort = process.env.REDIS_PORT || 6379;

    client = redis.createClient({
      url: `redis://${redisHost}:${redisPort}`,
    });

    client.on("error", (err) => {
      /**
       * if connection to the redis client has an error, we should reset the client object,
       * as the further calls to getRedisClient would not check the connection again, but would return the existing client..
       */
      client = null;

      throw new AppError({
        message:
          "Cannot connect to Redis in-memory database. Please contact the administrator to restart the redis service to continue..",
        shortMsg: "redis-connect-failed",
        statusCode: 503, // service unavailable
      });
    });

    await client.connect();
    return client;
  }
}

async function existsInListRedis({
  listName = "blacklistedTokens",
  value = null,
}) {
  if (value === null) {
    return true;
  }

  const client = await getRedisClient();
  const result = await client.LRANGE(listName, 0, -1);

  if (result.indexOf(value) > -1) {
    return true;
  } else {
    return false;
  }
}

async function insertValueRedis({
  listName = "blacklistedTokens",
  value = null,
}) {
  if (value === null) {
    return;
  }

  const client = await getRedisClient();

  if ((await existsInListRedis({ listName, value })) === false) {
    await client.LPUSH(listName, value);
  }
}

async function removeValueRedis({
  listName = "blacklistedTokens",
  value = null,
}) {
  if (value === null) {
    return;
  }

  const client = await getRedisClient();

  if ((await existsInListRedis({ listName, value })) === true) {
    // means remove atmost first 999 occurrences of value from the listName key..
    // so it should remove all occurrences of that value from the listName key..
    await client.LREM(listName, 999, value);
  }
}

module.exports = {
  getRedisClient,
  insertValueRedis,
  removeValueRedis,
  existsInListRedis,
};
