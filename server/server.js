if (process.env.NODE_ENV !== 'production') {
    /* either NODE_ENV will be 'production', or it can be set to nothing too.
    So, it assumes nothing also as 'development' mode.
    */
    require('dotenv').config({
        path: './.env',
    });
}

const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');

const ipfsMiddleware = require('./middlewares/ipfs.middleware');
const ipfsRouter = require('./routes/ipfs.route');
const { AppError } = require('./utils/errors.util');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(session({
    // express session
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // sameSite is set to lax, to prevent CSRF attack..
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hrs written in milliseconds
        secure: process.env.NODE_ENV === 'production', // secure only on production environment
        signed: true, // signed cookie
    }
}));

app.use('/ipfs', ipfsMiddleware.createIPFSNodeIfNA, ipfsRouter);

app.use((err, req, res, next) => {
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
