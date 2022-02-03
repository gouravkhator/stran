/**
 * A modified AppError to use as the error handling mechanism..
 * It will use statusCode, error message, short msg (to just identify the error and use switch case on short msg for doing certain actions).
 */
 class AppError {
    constructor({
        statusCode = 500,
        message = 'Server encountered some error. Please try after sometime..',
        shortMsg = 'server-err',
    } = {}) {
        this.statusCode = statusCode;
        this.message = message;
        this.shortMsg = shortMsg;
    }

    toString() {
        return `STATUS:[${this.statusCode}] | ${this.message}`;
    }
}

module.exports = {
    AppError,
};
