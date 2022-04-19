const { AppError } = require("./errors.util");
const {
  locationsList,
  languagesList,
  statusList,
  Location,
  Language,
  Status,
} = require("./enums.util");

/**
 * Cleanses up the user data and non-enum fields and enum-fields.
 * 
 * It's core functionality for enum fields
 * is to convert blockchain saved enum numbers into actual words.
 *  
 * Takes in the data which mostly comes from blockchain saved data,
 * and then cleanses those up.
 * 
 * user is passed as an object like below:
 * 
 *  {
 *    location: '0', // '0' for ASIA
 *    primaryLanguage: '2' // '2' for BENGALI
 *    knownLanguages: ['2', '1'] // '2' for BENGALI and '1' for ENGLISH
 *    status: '4' // '4' for OFFLINE
 *  }
 * @param {*} user Mostly, the fetched data from blockchain
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
        "User saved in the blockchain is in improper format, and cannot be parseable. Please contact the application owner with your public address..",
    });
  }
}

/**
 * Makes user data and its fields blockchain-compatible for saving..
 * 
 * Converts word-related user data fields into blockchain compatible enum numbers/ints
 * 
 * location is a string for example: "AMERICA"
 * 
 * primaryLanguage is a string for example: "ENGLISH"
 * 
 * knownLanguages is an array of strings for example: ["ENGLISH", "FRENCH"]
 * 
 * status is a string for example: "DND"
 */
function makeDataBlockchainCompat({
  location = null,
  primaryLanguage = null,
  knownLanguages = [],
  status = null,
}) {
  try {
    const compatLocation =
      location && location in Location ? Location[location] : null;
    const compatLanguage =
      primaryLanguage && primaryLanguage in Language
        ? Language[primaryLanguage]
        : null;

    const compatStatus = status && status in Status ? Status[status] : null;

    const compatKnownLanguages = knownLanguages?.reduce((tempList, val) => {
      const languageIndex = val in Language ? Language[val]: null;

      if (languageIndex < languagesList.length && languageIndex >= 0) {
        return [...tempList, languageIndex];
      } else {
        return [...tempList];
      }
    }, []);

    return {
      location: compatLocation,
      primaryLanguage: compatLanguage,
      status: compatStatus,
      knownLanguages: compatKnownLanguages,
    };
  } catch (err) {
    throw new AppError({
      statusCode: 500,
      shortMsg: "parsing-err",
      message:
        "Cannot parse some userdata in the server. Please contact the application owner with your public address..",
    });
  }
}

module.exports = {
  cleanseUserData,
  makeDataBlockchainCompat,
};
