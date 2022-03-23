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

const { allowCrossDomain } = require("./src/middlewares/global.middleware");
const {
  authenticateTokenMiddleware,
} = require("./src/middlewares/auth.middleware");
const { throwErrIfUserNotExist } = require("./src/middlewares/user.middleware");

const ipfsRouter = require("./src/routes/ipfs.route");
const authRouter = require("./src/routes/auth.route");
const userRouter = require("./src/routes/user.route");
const { AppError } = require("./src/utils/errors.util");

app.use(cookieParser(process.env.TOKEN_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(allowCrossDomain);

/**
 * We are using token authentication currently,
 * but uncomment the below session-based auth if needed, else would remove in future.
 */
/*
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax', // to prevent CSRF attack..
        maxAge: 24 * 60 * 60 * 1000, // 24 hrs written in milliseconds
        secure: process.env.NODE_ENV === 'production', // secure only on production environment
        signed: true, // signed cookie
    }
}));
*/

app.use("/ipfs", ipfsRouter);
app.use("/auth", authenticateTokenMiddleware, authRouter);
app.use(
  "/user",
  authenticateTokenMiddleware,
  throwErrIfUserNotExist,
  userRouter,
);

app.use((err, req, res, next) => {
  console.error(err); // just for debugging

  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      errorMsg: err.message,
      shortErrCode: err.shortMsg,
    });
  }

  return res.status(500).send({
    errorMsg: "Some internal server error..",
    shortErrCode: "server-err",
  });
});

const PORT = process.env.PORT ?? 8081;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
