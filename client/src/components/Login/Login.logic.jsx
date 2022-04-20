import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "preact/hooks";
import { bufferToHex } from "ethereumjs-util";
import { setError, setAccount, setUser, setMessage } from "../../store/actions";

import { getErrorObj } from "../../utils/general.util";

import {
  fetchNonce,
  getUserByToken,
  verifySignatureHandler,
} from "../../services/user-auth.service.js";

export default function LoginLogic() {
  const [loading, setLoading] = useState(false);

  // global state attributes
  const metamaskAcc = useSelector(({ metamask }) => metamask.accountAddress);
  const isMMConnected = useSelector(({ metamask }) => metamask.isConnected);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const userFromToken = await getUserByToken();

        /**
         * This step might feel redundant, as the Header component already checks if the user can be set via token..
         * But this step may be crucial if the Header does not re-render, and we have to check in Login step itself..
         */
        if (!!userFromToken?.username) {
          // token is valid, and we fetched the user using the JWT token itself
          dispatch(setError(null));
          dispatch(setUser(userFromToken));
        }
      } catch (err) {
        dispatch(setError(err.message ?? null));
      }
    })();
  }, []);

  const signNonce = async ({ nonce, publicAddress }) => {
    try {
      const msg = `I am signing my one-time number: ${nonce}`;
      const params = [bufferToHex(Buffer.from(msg, "utf-8")), publicAddress];

      return await ethereum.request({ method: "personal_sign", params });
    } catch (error) {
      throw getErrorObj({
        errorMsg:
          "Cannot sign the one-time nonce.. Please try to click on Login again",
        shortErr: "nonce-sign-error",
      });
    }
  };

  const handleLogin = async () => {
    try {
      // this function trick is done so that we can have the actual previous loading state in every setLoading call
      setLoading((previousLoadingState) => true);

      dispatch(setError(null));

      let accountAddress = null;

      if (!!isMMConnected) {
        accountAddress = metamaskAcc;
      } else {
        dispatch(setMessage("Please check your Metamask notification for letting the login complete.."));

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length === 0) {
          throw getErrorObj({
            errorMsg: "Please connect this webapp with a Metamask account..",
            shortErr: "no-accounts-selected",
          });
        }

        accountAddress = accounts[0];
      }

      dispatch(setAccount(accountAddress));

      const nonce = await fetchNonce(accountAddress);
      console.log({ nonce });

      if (!!nonce) {
        // if nonce is present, it means that user's account exists already..
        const signature = await signNonce({
          nonce,
          publicAddress: accountAddress,
        });

        console.log({ signature });
        const user = await verifySignatureHandler({
          signature,
          publicAddress: accountAddress,
        });

        // setting global message to null and disabling the loading part, to enable the Login button.
        dispatch(setMessage(null));
        setLoading((previousLoadingState) => false); // button loading should be false now

        if (!!user.username) {
          // token is successfully saved
          console.log("token is in the cookie now..");

          // sets user in the redux store
          dispatch(setUser(user));
          return;
        }
      } else {
        setLoading((previousLoadingState) => false); // button loading should be false now

        throw getErrorObj({
          errorMsg:
            "This account does not exist. Please sign up to create the account..",
          shortErr: "account-not-exist",
        });
      }
    } catch (err) {
      dispatch(setMessage(null));
      setLoading((previousLoadingState) => false); // button loading should be false now

      if (err?.code === 4001) {
        // these errors are when we click on cancel instead of processing the popups from Metamask
        dispatch(
          setError(
            "You clicked Cancel and didn't continue to sign in with Metamask..",
          ),
        );
      } else {
        dispatch(setError(err.errorMsg ?? null));
      }

      console.error(err);
    }
  };

  return {
    loading,
    handleLogin,
  };
}
