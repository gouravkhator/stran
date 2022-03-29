import { metamaskActions } from "../actions";

const metamaskInitialState = {
  /**
   * The connected account address for this webapp in metamask
   */
  accountAddress: "",
  /**
   * Is Metamask extension installed or not
   */
  isInstalled: true,
  /**
   * Is Metamask connected or not
   */
  isConnected: false,
};

const metamaskReducer = (state = metamaskInitialState, action) => {
  switch (action.type) {
    case metamaskActions.SET_ACC_ADDR:
      return {
        ...state,
        accountAddress: action.accountAddress,
        isConnected: true,
      };
    case metamaskActions.RESET_ACC_ADDR:
      return {
        ...state,
        accountAddress: metamaskInitialState.accountAddress,
        isConnected: false,
      };
    case metamaskActions.SET_IS_CONNECTED:
      return {
        ...state,
        isConnected: action.isMetamaskConnected,
      };
    case metamaskActions.SET_IS_INSTALLED:
      return {
        ...state,
        isInstalled: action.isMetamaskInstalled,
      };
    default:
      return {
        ...state,
      };
  }
};

export default metamaskReducer;
