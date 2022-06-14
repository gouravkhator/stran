import { getErrorObj } from "../utils/general.util";

/**
 * This error happens when the server is not responding to the fetch events,
 * or the client's internet/browser is not allowing the fetch to occur.
 */
const FETCH_ERR = getErrorObj({
  errorMsg:
    "We are unable to connect to our network to process this request! Please check if you are connected to the internet or not.",
  shortErr: "fetch-server-failed",
});

/**
 * @returns UserId of the random available user, if any,
 * otherwise it throws an error that no available user found
 */
export async function getRandomAvailableUser() {
  let result = null;

  /**
   * errorFromServer is a flag, if we want to have the error thrown from server,
   * to be shown to all components who calls this handler function..
   */
  let errorFromServer = false;

  try {
    result = await fetch("http://localhost:8081/users/random/available", {
      method: "GET",
      credentials: "include",
    });

    const data = await result.json();

    if (data.status === "success") {
      return data.randomAvailableUserId;
    }

    if (data.status === "error") {
      errorFromServer = true;

      throw getErrorObj({
        errorMsg: data.errorMsg, // server thrown long error msg
        shortErr: data.shortErrCode, // server thrown short error msg
      });
    }

    return null;
  } catch (err) {
    if (result === null) {
      // fetch was unsuccessful
      throw FETCH_ERR;
    }

    if (errorFromServer === true) {
      // if error from server flag is true, then we directly throw that server error.
      throw err;
    }

    return null;
  }
}
