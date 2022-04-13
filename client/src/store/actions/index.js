/*-----Action Object generator functions----- */
export const setAccount = (accountAddress = null) => {
  if (!accountAddress) {
    return { type: metamaskActions.RESET_ACC_ADDR };
  } else {
    return { type: metamaskActions.SET_ACC_ADDR, accountAddress };
  }
};

export const setIsInstalled = (isMetamaskInstalled = false) => {
  return {
    type: metamaskActions.SET_IS_INSTALLED,
    // if the passed data is boolean, then we set that, else we set false
    isMetamaskInstalled:
      typeof isMetamaskInstalled === "boolean" ? isMetamaskInstalled : false,
  };
};

export const setIsConnected = (isMetamaskConnected = false) => {
  return {
    type: metamaskActions.SET_IS_CONNECTED,
    // if the passed data is boolean, then we set that, else we set false
    isMetamaskConnected:
      typeof isMetamaskConnected === "boolean" ? isMetamaskConnected : false,
  };
};

export const setUser = (user = null, toEdit = false) => {
  if (!user || !user?.username) {
    // user passed is empty, or if user's username is not set, meaning user passed might be an empty object..
    return {
      type: userActions.REMOVE_USER,
    };
  } else if (toEdit === true) {
    // user passed is not empty and to edit is true
    return {
      type: userActions.EDIT_USER,
      user,
    };
  } else {
    // user passed is not empty, and to edit is false
    // so we need to set the user
    return {
      type: userActions.SET_USER,
      user,
    };
  }
};

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

/*-----Action names as objects-----*/
export const metamaskActions = {
  SET_ACC_ADDR: "SET_ACC_ADDR",
  RESET_ACC_ADDR: "RESET_ACC_ADDR",
  SET_IS_CONNECTED: "SET_IS_CONNECTED",
  SET_IS_INSTALLED: "SET_IS_INSTALLED",
};

export const userActions = {
  SET_USER: "SET_USER",
  EDIT_USER: "EDIT_USER",
  REMOVE_USER: "REMOVE_USER",
};

export const globalActions = {
  SET_ERR: "SET_ERR",
  RESET_ERR: "RESET_ERR",
};
