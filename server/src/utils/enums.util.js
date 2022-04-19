/**
 * Converts array to un-modifiable objects,
 * with array values as the key and indices as the values in the object..
 */
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

/**
 * Location is an object like below:
 * 
 *  {
 *    "ASIA": 0,
 *    "EUROPE": 1,
 *    ..... 
 *  }
 */
const Location = convertArrToEnum(locationsList);

// Status - an enum for tracking the availability state of the user
const statusList = ["AVAILABLE", "DND", "BRB", "AWAY", "OFFLINE"];

const Status = convertArrToEnum(statusList);

module.exports = {
  Language,
  Location,
  Status,
  locationsList,
  languagesList,
  statusList,
};
