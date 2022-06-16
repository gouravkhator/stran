import { globalActions } from "../actions";

const initialState = {
  error: "",
  message: "",
  bannerMsg: "",
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case globalActions.SET_ERR:
      return {
        ...state,
        error: action.errorMsg,
      };
    case globalActions.RESET_ERR:
      return {
        ...state,
        error: initialState.error, // resets to the initial error state
      };
    case globalActions.SET_MSG:
      return {
        ...state,
        message: action.message,
      };
    case globalActions.RESET_MSG:
      return {
        ...state,
        message: initialState.message, // resets to the initial error state
      };
    case globalActions.SET_BANNER_MSG:
      return {
        ...state,
        bannerMsg: action.bannerMsg,
      };
    case globalActions.RESET_BANNER_MSG:
      return {
        ...state,
        bannerMsg: initialState.bannerMsg,
      };
    default:
      return {
        ...state,
      };
  }
};

export default globalReducer;
