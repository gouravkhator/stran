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

export async function getUserByToken() {
  let result = null;

  try {
    result = await fetch(`http://localhost:8081/user`, {
      method: "GET",
      /**
       * this sends the credentials like cookies and other headers in a secure way
       * JWT token is saved in the cookie itself.
       */
      credentials: "include",
    });

    const data = await result.json();
    return data.user ?? null;
  } catch (err) {
    if (result === null) {
      // fetch was unsuccessful
      throw FETCH_ERR;
    }

    return null;
  }
}

export async function editUserHandler({
  publicAddress,
  username = null,
  location = null,
  primaryLanguage = null,
  status = null,
  knownLanguages = null,
}) {
  let result = null;

  /**
   * errorFromServer is a flag, if we want to have the error thrown from server,
   * to be shown to all components who calls this handler function..
   */
  let errorFromServer = false;

  try {
    result = await fetch("http://localhost:8081/user", {
      body: JSON.stringify({
        username,
        location,
        primaryLanguage,
        status,
        knownLanguages,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      credentials: "include",
    });

    const data = await result.json();

    if (data.status === "success") {
      return data.user;
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

export async function deleteUserHandler() {
  let result = null;

  /**
   * errorFromServer is a flag, if we want to have the error thrown from server,
   * to be shown to all components who calls this handler function..
   */
  let errorFromServer = false;

  try {
    result = await fetch("http://localhost:8081/user", {
      method: "DELETE",
      credentials: "include",
    });

    const data = await result.json();

    if (data.status === "success") {
      return {
        deletedUser: true,
        userid: data.userid,
      };
    }

    if (data.status === "error") {
      errorFromServer = true;

      throw getErrorObj({
        errorMsg: data.errorMsg, // server thrown long error msg
        shortErr: data.shortErrCode, // server thrown short error msg
      });
    }

    return {
      deletedUser: false,
    };
  } catch (err) {
    if (result === null) {
      // fetch was unsuccessful
      throw FETCH_ERR;
    }

    if (errorFromServer === true) {
      // if error from server flag is true, then we directly throw that server error.
      throw err;
    }

    return {
      deletedUser: false,
    };
  }
}
