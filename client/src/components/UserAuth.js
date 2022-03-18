import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { bufferToHex } from "ethereumjs-util";

import SignupForm from "./Widgets/SignupForm";

import {
  fetchNonce,
  getUserByToken,
  signupHandler,
  verifySignatureHandler,
} from "../services/user-auth.service.js";

// TODO: UserAuth is very much incomplete..
const UserAuth = ({ ethereum, account, setAccount, setError }) => {
  const [signupFormVisible, setSignupFormVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await getUserByToken();
      console.log({ userFromToken: user });
    })();

    if (account !== null) {
      // TODO: check if the token is also set, and that can be checked by sending a request to server with the cookies
    }
  }, []);

  const signNonce = async ({ nonce, publicAddress }) => {
    const msg = `I am signing my one-time number: ${nonce}`;

    const params = [bufferToHex(Buffer.from(msg, "utf-8")), publicAddress];

    return await ethereum.request({ method: "personal_sign", params });
  };

  const handleLogin = async () => {
    try {
      setError("");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        setError("Please connect this dapp with a Metamask account..");
        return;
      }

      setAccount(accounts[0]);

      const nonce = await fetchNonce(accounts[0]);

      console.log({ nonce });

      if (nonce !== null) {
        const signature = await signNonce({
          nonce,
          publicAddress: accounts[0],
        });

        console.log({ signature });
        const user = await verifySignatureHandler({
          signature,
          publicAddress: accounts[0],
        });

        console.log("token is in the cookie now..");
      } else {
        setSignupFormVisible(true); // the sign up form will now be visible..
      }
    } catch (err) {
      // TODO: check the different errors and set error accordingly
      console.error(err);
      // error could have happened in the request accounts method, where user rejected that request
      setError(
        "We see that you didn't connect any account in Metamask.. Please do that and try logging in again..",
      );
    }
  };

  const handleLogout = async () => {
    // TODO: clear the JWT tokens too.
    setAccount("");
    setError("");
  };

  return (
    <div>
      <button onClick={() => handleLogin()}>Login with MetaMask</button>

      {signupFormVisible && (
        <SignupForm
          signupHandler={({ publicAddress, name }) =>
            signupHandler({ publicAddress, name })
          }
        />
      )}
    </div>
  );
};

export default UserAuth;
