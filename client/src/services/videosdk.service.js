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

export async function getAccessTokenVideoSDK() {
  let result = null,
    errorFromServer = false;

  try {
    result = await fetch(`http://localhost:8081/videosdk/get-videosdk-token`, {
      method: "GET",
      /**
       * this sends the credentials like cookies and other headers in a secure way
       * JWT token is saved in the cookie itself.
       */
      credentials: "include",
    });

    const data = await result.json();

    if (data.status === "success") {
      return data.videoSDKToken;
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

export async function createMeeting({ videoSDKToken }) {
  let result = null,
    errorFromServer = false;

  try {
    result = await fetch(`http://localhost:8081/videosdk/create-meeting`, {
      method: "POST",
      /**
       * this sends the credentials like cookies and other headers in a secure way
       * JWT token is saved in the cookie itself.
       */
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoSDKToken: videoSDKToken,
      }),
    });

    const data = await result.json();

    if (data.status === "success") {
      return data.meetingData.meetingId;
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
