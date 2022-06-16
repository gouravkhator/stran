/*-----Action names as objects-----*/
// ? NOTE: we use Object.freeze so that these actions cannot be changed anywhere..

export const globalActions = Object.freeze({
  SET_ERR: "SET_ERR",
  RESET_ERR: "RESET_ERR",
  SET_MSG: "SET_MSG",
  RESET_MSG: "RESET_MSG",
  SET_BANNER_MSG: "SET_BANNER_MSG",
  RESET_BANNER_MSG: "RESET_BANNER_MSG",
});

/*-----Action Object generator functions----- */
export const setError = (errorMsg = null) => {
  if (!errorMsg) {
    return {
      type: globalActions.RESET_ERR,
    };
  } else {
    return {
      type: globalActions.SET_ERR,
      errorMsg,
    };
  }
};

export const setMessage = (message = null) => {
  if (!message) {
    return {
      type: globalActions.RESET_MSG,
    };
  } else {
    return {
      type: globalActions.SET_MSG,
      message,
    };
  }
};

export const setBannerMsg = (bannerMsg = null) => {
  if (!bannerMsg) {
    return {
      type: globalActions.RESET_BANNER_MSG,
    };
  } else {
    return {
      type: globalActions.SET_BANNER_MSG,
      bannerMsg,
    };
  }
};
