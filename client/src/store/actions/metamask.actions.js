/*-----Action names as objects-----*/
// ? NOTE: we use Object.freeze so that these actions cannot be changed anywhere..

export const metamaskActions = Object.freeze({
  SET_ACC_ADDR: "SET_ACC_ADDR",
  RESET_ACC_ADDR: "RESET_ACC_ADDR",
  SET_IS_CONNECTED: "SET_IS_CONNECTED",
  SET_IS_INSTALLED: "SET_IS_INSTALLED",
});

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
