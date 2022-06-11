/*-----Action names as objects-----*/
// ? NOTE: we use Object.freeze so that these actions cannot be changed anywhere..

export const userActions = Object.freeze({
  SET_USER: "SET_USER",
  EDIT_USER: "EDIT_USER",
  REMOVE_USER: "REMOVE_USER",
});

/*-----Action Object generator functions----- */

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
