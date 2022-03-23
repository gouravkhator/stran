const { AppError } = require("./errors.util");
const { locationsList, languagesList, statusList } = require("./enums.util");

/**
 * Cleans up the user data and fields. Also, does parsing of solidity enums.
 *
 * This is done so that at client end, we will have only the cleaned data
 * @param {*} user
 * @returns The cleansed user with proper fields and data values..
 */
function cleanseUserData(user = {}) {
  try {
    /**
     * Do note that here we are not transforming userid field to an integer,
     * as it is a string like "0x<some hexadecimal value>".
     *
     * And parsing the hexademical string to int will the make the int too large sometimes.
     * So, for user exists checks, we check if username is empty string or not.
     * As if user does not exist, then also the userid will "0x<many zeros>"
     */
    if (user?.username === "") {
      return user;
    }

    user.location = locationsList.at(parseInt(user.location));
    user.primaryLanguage = languagesList.at(parseInt(user.primaryLanguage));
    user.status = statusList.at(parseInt(user.status));

    user.knownLanguages = user.knownLanguages?.reduce((tempList, val) => {
      const languageIndex = parseInt(val);

      if (languageIndex < languagesList.length && languageIndex >= 0) {
        return [...tempList, languagesList.at(languageIndex)];
      } else {
        return [...tempList];
      }
    }, []);

    return user;
  } catch (err) {
    throw new AppError({
      statusCode: 400,
      shortMsg: "user-not-parseable",
      message:
        "User saved in the database is in improper format, and cannot be parseable. Please contact the application owner with your public address..",
    });
  }
}

module.exports = {
  cleanseUserData,
};
