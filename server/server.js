// if (process.env.NODE_ENV !== "production") {
//   /* either NODE_ENV will be 'production', or it can be set to nothing too.
//     So, it assumes nothing also as 'development' mode.
//     */
//   require("dotenv").config({
//     path: "./.env",
//   });
// }

const express = require("express");
const app = express();
// const session = require('express-session'); // for session-based auth
const cookieParser = require("cookie-parser");
// const helmet = require('helmet');
const cors = require("cors");

const {
  makeImpConnectionsMiddleware,
} = require("./src/middlewares/global.middleware");
const {
  authenticateTokenMiddleware,
} = require("./src/middlewares/auth.middleware");
const { throwErrIfUserNotExist } = require("./src/middlewares/user.middleware");

const ipfsRouter = require("./src/routes/ipfs.route");
const authRouter = require("./src/routes/auth.route");
const userRouter = require("./src/routes/user.route");
const otherUsersRouter = require("./src/routes/other-users.route");

const { AppError } = require("./src/utils/errors.util");

/**
 * Cookie parser middleware helps sign and unsign every cookie with the secret as process.env.SERVER_TOKEN_SECRET
 */
app.use(cookieParser(process.env.SERVER_TOKEN_SECRET));

/**
 * express.json() is a method, to recognize the incoming Request Object as a JSON Object.
 *
 * express.urlencoded() is a method, to recognize the incoming Request Object as strings or arrays.
 *
 * You NEED express.json() and express.urlencoded() just for POST and PUT requests,
 * because in both these requests you are sending data to the server and
 * you are asking the server to accept or store that data (object),
 * which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * CORS allows us to deploy client to any other origin
 * and then only accept authenticated requests from those origins..
 * -----------------------------------------------------------------
 *
 * CORS, by default, takes care of the Pre-flight requests,
 * which are required for non-GET and non-POST requests..
 *
 * Without the pre-flight requests, the requests like PUT, PATCH or DELETE will not work in cross origin requests..
 * ---------------------------------------------------------------------------
 *
 * Headers set by CORS with below options are:
 * res.header("Access-Control-Allow-Origin", `http://localhost:${process.env.CLIENT_PORT}`);
 * res.header("Access-Control-Allow-Credentials", true);
 * res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
 * res.header("Access-Control-Allow-Headers", "Content-Type");
 */
app.use(
  cors({
    origin: `http://localhost:${process.env.CLIENT_PORT}`, // the origin from which this server can accept authenticated requests
    credentials: true, // allow credentials
    methods: "GET, PUT, POST, DELETE", // allowed methods for the cross origin requests
    allowedHeaders: "Content-Type", // allowed headers for the cross origin requests
    optionsSuccessStatus: 200, // success status code sent for the OPTIONS request
  }),
);

/**
 * Helmet helps secure ExpressJS apps by setting various headers..
 */
// app.use(helmet()); // !ISSUE: enabling helmet works fine for all use cases, except the token passing from server to client

app.use(makeImpConnectionsMiddleware);

app.get("/healthcheck", (req, res) => {
  // this healthcheck is a very basic health checker, and most errors are thrown before the route hits this.
  // if the route gets through it, it sends a 200 OK message.
  return res.status(200).send({
    message: "Healthcheck worked fine.. Server is healthy",
    status: "success",
  });
});

app.use("/ipfs", ipfsRouter);
app.use("/auth", authenticateTokenMiddleware, authRouter);

app.use(
  "/user",
  authenticateTokenMiddleware,
  throwErrIfUserNotExist,
  userRouter,
);

// this route is for getting friends' data or some available random user's ids
app.use(
  "/users",
  authenticateTokenMiddleware,
  throwErrIfUserNotExist,
  otherUsersRouter,
);

// error handling route
app.use((err, req, res, next) => {
  console.error(err); // just for debugging

  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      errorMsg: err.message,
      shortErrCode: err.shortMsg,
      status: "error", // status will be error or success
    });
  }

  return res.status(500).send({
    errorMsg: "Some internal server error..",
    shortErrCode: "server-err",
    status: "error",
  });
});

// make necessary checks and any connections, before starting the server
(() => {
  try {
    const serverCrashError = new AppError({
      statusCode: 500,
      message:
        "Some internal server error occurred, so the admins would restart the server after fixing the issues. Please wait and try again later..",
      shortMsg: "server-err",
    });

    /**
     * This checks if the necessary environment variables are loaded or not.
     * If not loaded, we would throw the error, and stop the server.
     *
     * Some environment variables like SERVER_PORT, REDIS_HOST, REDIS_PORT,
     * BLOCKCHAIN_HOST, BLOCKCHAIN_NETWORK or BLOCKCHAIN_PORT are either loaded or set with our defaults.
     *
     * But for necessary envs like SERVER_TOKEN_SECRET should not be set with our defaults.
     */
    const isNecessaryEnvsPresent = !!process.env.SERVER_TOKEN_SECRET;

    if (isNecessaryEnvsPresent === false) {
      throw serverCrashError;
    }

    const PORT = process.env.SERVER_PORT || 8081;

    // only start listening for this server, if all the necessities are satisfied..
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
