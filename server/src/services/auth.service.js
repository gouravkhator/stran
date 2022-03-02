const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors.util');

function generateAccessToken(userid) {
    return jwt.sign({ userid }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}

function authenticateToken(token) {
    try {
        token = token ?? null;

        if (token === null) {
            throw new AppError({
                statusCode: 401, // unauthorized request
                shortMsg: 'token-not-provided',
                message: 'Please provide valid authorization token to make this request..',
            });
        }

        let tempUserId = null, authenticated = false;

        jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
            if (err) {
                throw new AppError({
                    statusCode: 403, // forbidden, as the token was invalid
                    shortMsg: 'invalid-token-provided',
                    message: 'Please provide valid token. This token is either invalid or has expired..',
                });
            }

            tempUserId = result.userid;
            authenticated = true;
        });

        return {
            authenticated,
            userid: tempUserId,
        };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    generateAccessToken,
    authenticateToken,
};
