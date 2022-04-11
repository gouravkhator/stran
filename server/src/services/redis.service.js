const redis = require("redis");
const { AppError } = require("../utils/errors.util");

// TODO: create child process for connecting with redis server

let client = null;

async function getRedisClient() {
  if (client !== null) {
    return client;
  } else {
    client = redis.createClient({
      url: "redis://localhost:6379",
      // For Docker, comment above and uncomment the below..
      // url: "redis://redis-server:6379",
    });

    client.on("error", (err) => {
      throw new AppError({
        message:
          "Could not connect to Redis in-memory database. Please wait before making any auth request..",
        shortMsg: "redis-connect-err",
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
