/**
 * Middleware to allow CORS requests from Client side..
 */
function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    return next();
}

module.exports = {
    allowCrossDomain,
};
