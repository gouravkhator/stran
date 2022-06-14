export const convertArrToObj = (arr = []) => {
  return [...arr].reduce((tempObj, element) => {
    return { ...tempObj, [element]: element };
  }, {});
};

/**
 * Returns a custom error object which we can throw..
 *
 * This is useful, as it encompasses long descriptive error messages with short error msg too..
 */
export const getErrorObj = ({ errorMsg, shortErr }) => {
  return {
    errorMsg,
    shortErr: shortErr ?? errorMsg,
  };
};

export const capitalizeString = (string = "") => {
  if (string === null || string.length === 0) {
    return "";
  }

  // if string is of length 1, then string.substring(1) will return "", so no checks needed for that
  return string.charAt(0).toUpperCase() + string.substring(1);
};
