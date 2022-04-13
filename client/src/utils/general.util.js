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
