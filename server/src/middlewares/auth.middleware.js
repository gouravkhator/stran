const { authenticateToken } = require('../services/auth.service');
const { getUserData } = require('../services/smart-contract.service');

async function authenticateTokenMiddleware(req, res, next) {
    let authenticated = false, userid = null;

    try {
        const token = req.signedCookies['jwtToken'] ?? null;

        const result = authenticateToken(token);

        authenticated = result.authenticated;
        userid = result.userid;

        // if authenticated is false, authenticateToken should have already thrown the error
        if (authenticated === true) {
            req.user = await getUserData(userid, userid);

            return next();
        }
    } catch (err) {
        if (authenticated === true) {
            // then we got error in fetching user data
            return next(err);
        } else {
            // else we got error in the verification of token
            req.user = null;
            req.userid = null;
            return next();
        }
    }
}

async function returnUserIfUserExists(req, res, next) {
    try {
        if (req.user && req.user.username) {
            return res.json({
                user: req.user,
            });
        } else {
            return next();
        }
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateTokenMiddleware,
    returnUserIfUserExists,
};
