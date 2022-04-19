const { AppError } = require("./errors.util");
const lodash = require("lodash");

/**
 * Check if the parameter provided is a valid hex address or not
 * @param {*} data Any Javascript string, which will be passed through the validation checks.
 * @returns true if it is valid hex address, otherwise false
 */
const validateHexAddress = (data) => {
  data = data ?? "";

  return (
    data !== "" &&
    typeof data === "string" &&
    data.startsWith("0x") &&
    data.length > 2
  );
};

/**
 * Does sanity checking of the params for the smart contract service methods
 * @returns True if the params provided, are safe, else False
 */
const validateSmartContractParams = ({ senderAccAddr }) => {
  senderAccAddr = senderAccAddr ?? "";

  if (validateHexAddress(senderAccAddr) === true) {
    return true;
  } else {
    throw new AppError({
      message: "Please provide valid blockchain account address..",
      shortMsg: "invalid-account",
      statusCode: 401,
    });
  }
};

/**
 * Checks if any fields are modified really or not,
 * and if no fields are modified, then it throws the error
 */
function checkIfUpdateRequired({ existingUser, newUserData }) {
  try {
    /**
     * Tracks the count of how many fields are different for existing user and new user
     */
    let countNotSameData = 0;

    if (
      newUserData.username !== null &&
      existingUser.username !== newUserData.username
    ) {
      countNotSameData++;
    }

    if (
      newUserData.location !== null &&
      existingUser.location !== newUserData.location
    ) {
      countNotSameData++;
    }

    if (
      newUserData.primaryLanguage !== null &&
      existingUser.primaryLanguage !== newUserData.primaryLanguage
    ) {
      countNotSameData++;
    }

    if (
      newUserData.status !== null &&
      existingUser.status !== newUserData.status
    ) {
      countNotSameData++;
    }

    // this checks if those two knownLanguages array have different elements (irrespective of the order of those values)
    // if the xor of those arrays is not empty, then we conclude that those are different arrays.
    const areKnownLanguagesDifferent = !lodash.isEmpty(
      lodash.xor(existingUser.knownLanguages, newUserData.knownLanguages),
    );

    if (newUserData.knownLanguages != null && areKnownLanguagesDifferent) {
      countNotSameData++;
    }

    if (countNotSameData > 0) {
      // if there is atleast 1 different field, we return true meaning update is required..
      return true;
    }

    throw new AppError({
      statusCode: 400,
      shortMsg: "no-modification-needed",
      message: "Data passed does not require any modifications.",
    });
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw err;
  }
}

module.exports = {
  checkIfUpdateRequired,
  validateSmartContractParams,
  validateHexAddress,
};
