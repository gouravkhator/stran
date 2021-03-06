import { useDispatch, useSelector } from "react-redux";
import { useState } from "preact/hooks";
import { bufferToHex } from "ethereumjs-util";
import { setError, setAccount, setUser, setMessage } from "../../store/actions";

import { getErrorObj } from "../../utils/general.util";

import {
  fetchNonce,
  verifySignatureHandler,
} from "../../services/auth-routes.service";

export default function LoginLogic() {
  const [loading, setLoading] = useState(false);

  // global state attributes
  const metamaskAcc = useSelector(({ metamask }) => metamask.accountAddress);
  const isMMConnected = useSelector(({ metamask }) => metamask.isConnected);

  const dispatch = useDispatch();

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
        dispatch(
          setMessage(
            "Please check your Metamask notification for letting the login complete..",
          ),
        );

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

      if (!!nonce) {
        // if nonce is present, it means that user's account exists already..
        const signature = await signNonce({
          nonce,
          publicAddress: accountAddress,
        });

        const user = await verifySignatureHandler({
          signature,
          publicAddress: accountAddress,
        });

        // setting global message to null and disabling the loading part, to enable the Login button.
        dispatch(setMessage(null));
        setLoading((previousLoadingState) => false); // button loading should be false now

        if (!!user.username) {
          // token is successfully saved
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

      if (!err) {
        return;
      }

      if (err?.code === 4001) {
        // these errors are when we click on cancel instead of processing the popups from Metamask
        dispatch(
          setError(
            "You clicked Cancel and didn't continue to sign in with Metamask..",
          ),
        );
      } else {
        dispatch(
          setError(
            err.errorMsg ??
              "Some issues occurred with SignIn with MetaMask!! Please check if there are any pending notifications in MetaMask wallet, and try to resolve them before trying to Login here.",
          ),
        );
      }
    }
  };

  return {
    loading,
    handleLogin,
  };
}
