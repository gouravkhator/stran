if (process.env.NODE_ENV !== "production") {
  /* either NODE_ENV will be 'production', or it can be set to nothing too.
    So, it assumes nothing also as 'development' mode.
    */
  require("dotenv").config({
    path: "./.env",
  });
}

const express = require("express");
const app = express();
// const session = require('express-session'); // for session-based auth
const cookieParser = require("cookie-parser");
// const helmet = require('helmet');
const cors = require("cors");

const {
  authenticateTokenMiddleware,
} = require("./src/middlewares/auth.middleware");
const { throwErrIfUserNotExist } = require("./src/middlewares/user.middleware");

const ipfsRouter = require("./src/routes/ipfs.route");
const authRouter = require("./src/routes/auth.route");
const userRouter = require("./src/routes/user.route");
const otherUsersRouter = require("./src/routes/other-users.route");
const videoSDKRouter = require("./src/routes/videosdk.route");

const { AppError } = require("./src/utils/errors.util");

/**
 * Cookie parser middleware helps sign and unsign every cookie with the secret as process.env.TOKEN_SECRET
 */
app.use(cookieParser(process.env.TOKEN_SECRET));

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
 * res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
 * res.header("Access-Control-Allow-Credentials", true);
 * res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
 * res.header("Access-Control-Allow-Headers", "Content-Type");
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL, // the origin from which this server can accept authenticated requests
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

// this route is used for video sdk api (would be removed later, as we are not using it now)
app.use(
  "/videosdk",
  authenticateTokenMiddleware,
  throwErrIfUserNotExist,
  videoSDKRouter,
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

const PORT = process.env.PORT ?? 8081;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
