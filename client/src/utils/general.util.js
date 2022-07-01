export const BACKEND_URL = `http://${
  process.env.PREACT_APP_BACKEND_HOST ?? "localhost"
}:${process.env.PREACT_APP_BACKEND_PORT ?? 8081}`;

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

export const isValidBlockchainUserId = (userid = "") => {
  userid = userid ?? "";

  return (
    userid !== "" &&
    typeof userid === "string" &&
    userid.startsWith("0x") &&
    userid.length > 2
  );
};
