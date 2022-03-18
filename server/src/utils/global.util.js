/**
 * Base options for setting cookies, either secure or normal ones..
 */
const baseCookieOptions = {
  maxAge: 24 * 60 * 60 * 1000, // expires in 24 hrs (number written in milliseconds)
  sameSite: "lax", // to prevent CSRF attack
  secure: process.env.NODE_ENV === "production", // secure only on production environment
};

/**
 * For setting secure cookies which shouldn't be accessed by client-side javascript
 */
const secureCookieOptions = {
  ...baseCookieOptions,
  signed: true, // signed cookie
  httpOnly: true, // to prevent XSS atack, as the cookies will not be accessible by javascript in client side
};

/**
 * For setting normal cookies, which can be accessed by client-side javascript with no security concerns.
 */
const normalCookieOptions = {
  ...baseCookieOptions,
};

module.exports = {
  secureCookieOptions,
  normalCookieOptions,
};
