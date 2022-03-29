import { userActions } from "../actions";

const initialState = {
  userdata: {},
  loggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userActions.SET_USER:
      // this sets the user fully
      // it does not allow us to set just only a particular attribute
      return {
        ...state,
        userdata: { ...action.user },
        loggedIn: true,
      };
    case userActions.EDIT_USER:
      // this only edits some properties and allows to use other existing properties on that user
      return {
        ...state,
        userdata: { ...state.user, ...action.user },
      };
    case userActions.REMOVE_USER:
      return {
        ...state,
        userdata: {},
        loggedIn: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default userReducer;
