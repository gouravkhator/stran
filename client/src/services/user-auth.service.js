/**
 * This error happens when the server is not responding to the fetch events,
 * or the client's internet/browser is not allowing the fetch to occur.
 */
const FETCH_ERR =
  "Please check if you are connected to the internet or not. We are unable to connect to the decentralized storage to log you in..";

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
      throw new Error(FETCH_ERR);
    }

    return null;
  }
}

export async function fetchNonce(publicAddress) {
  let result = null;

  try {
    result = await fetch(`http://localhost:8081/auth/nonce/${publicAddress}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await result.json();

    if (data.status === "success" && data.nonce !== null) {
      return data.nonce;
    }

    return null;
  } catch (err) {
    if (result === null) {
      // fetch was unsuccessful
      throw new Error(FETCH_ERR);
    }

    return null;
  }
}

export async function signupHandler({
  publicAddress,
  name,
  // primaryLocation,
  // primaryLanguage,
  // knownLanguages,
}) {
  let result = null;

  try {
    result = await fetch("http://localhost:8081/auth/signup", {
      body: JSON.stringify({
        publicAddress,
        name,
        // primaryLocation,
        // primaryLanguage,
        // knownLanguages,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });

    const data = await result.json();
    if (data.status === "success") {
      return data.user;
    }

    return null;
  } catch (err) {
    if (result === null) {
      // fetch was unsuccessful
      throw new Error(FETCH_ERR);
    }

    return null;
  }
}

export async function verifySignatureHandler({ publicAddress, signature }) {
  let result = null;

  try {
    result = await fetch("http://localhost:8081/auth/verify", {
      body: JSON.stringify({
        publicAddress,
        signature,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });

    const data = await result.json();
    if (data.status === "success") {
      // if the status is success, then the token is saved in the cookie already from the server end.
      return data.user;
    }

    return null;
  } catch (err) {
    if (result === null) {
      // fetch was unsuccessful
      throw new Error(FETCH_ERR);
    }

    return null;
  }
}

export async function logoutHandler() {
  let result = null;

  try {
    result = await fetch("http://localhost:8081/auth/logout", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });

    const data = await result.json();
    if (data.status === "success") {
      // if the status is success, then the token will be reset in the cookie from server end.
      return {
        loggedOut: true,
      };
    }

    return {
      loggedOut: false,
    };
  } catch (err) {
    if (result === null) {
      // fetch was unsuccessful
      throw new Error(FETCH_ERR);
    }

    return {
      loggedOut: false,
    };
  }
}
