const { AppError } = require("./errors.util");

function parseEnumsInUser(user = {}) {
  try {
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
      status: 400,
      shortMsg: "user-not-parseable",
      message:
        "User saved in the database is in improper format, and cannot be parseable. Please contact the application owner with your public address..",
    });
  }
}

function convertArrToEnum(list = []) {
  const finalObj = list.reduce((object, val, index) => {
    return {
      ...object,
      [val]: index,
    };
  }, {});

  Object.freeze(finalObj);
  return finalObj;
}

// Language - an enum for the filter for users, to call a stranger speaking a particular language only
const languagesList = [
  "ENGLISH",
  "HINDI",
  "BENGALI",
  "FRENCH",
  "SPANISH",
  "RUSSIAN",
  "SINDHI",
  "GERMAN",
  "CHINESE",
  "JAPANESE",
  "ITALIAN",
  "MALYALAM",
  "ORIYA",
  "POLISH",
  "ROMANIAN",
  "TAMIL",
  "TELUGU",
  "TURKISH",
  "UKRANIAN",
  "PUNJABI",
  "URDU",
  "MALAYSIAN",
  "KANNADA",
  "NEPALI",
  "ASSAMESE",
  "BHOJPURI",
  "GREEK",
  "GUJARATI",
  "INDONESIAN",
  "KOREAN",
];

const Language = convertArrToEnum(languagesList);

// Location - an enum for the filter for users, to call a stranger living in a particular location
const locationsList = [
  "ASIA",
  "EUROPE",
  "AMERICA",
  "AUSTRALIA",
  "AFRICA",
  "ANTARCTICA",
];

const Location = convertArrToEnum(locationsList);

// Status - an enum for tracking the availability state of the user
const statusList = ["AVAILABLE", "DND", "BRB", "AWAY", "OFFLINE"];

const Status = convertArrToEnum(statusList);

module.exports = {
  Language,
  Location,
  Status,
  parseEnumsInUser,
};
