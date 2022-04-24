/** @jsx h */
import { h } from "preact";
import style from "../styles/auth.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "preact-router/match";

import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";
import ConnectMM from "../components/ConnectMetamask/ConnectMM";

import { useMetamask } from "../custom-hooks/MetamaskCustomHooks";
import { useEffect } from "preact/hooks";
import { setError } from "../store/actions";

/**
 * AuthPage Logic tree:
 *
 *                  User Logged In
 *                Yes /           \  No
 *      (Redirect to Profile)  (..............Is Metamask Installed.................)
 *                                    Yes  /                           \ No
 *  (Compute MM connect Logic and show Login/Signup components)       (Show MM not installed error)
 *        /                        AND              \
 *    (........Is MM connected?......)      (Show Login and Signup components)
 *   Yes /                        \ No
 * (Show connected success msg)  (Show connect MM component)
 */
export default function AuthPage() {
  useMetamask(); // our own useMetamask custom hook

  const error = useSelector(({ global }) => global.error);
  const message = useSelector(({ global }) => global.message);

  const isMMInstalled = useSelector(({ metamask }) => metamask.isInstalled);
  const isMMConnected = useSelector(({ metamask }) => metamask.isConnected);

  const isLoggedIn = useSelector(({ user }) => user.loggedIn);
  const user = useSelector(({ user }) => user.userdata);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!!user.username) {
      // if user exists, don't show any metamask errors.
      // this setError(null) shadows/overwrites all the errors set by useMetamask() custom hook
      dispatch(setError(null));
    }
  }, [user]);

  const profileRedirectComponent = (
    <div>
      <p>You are already authenticated</p>
      <Link href="/profile">
        {/**
         * This space trick is for providing space after the text "profile"
         * as we are writing span element in new line, which will be displayed inline in html..
         */}
        Go to the profile:{" "}
        <span>
          <b>{user.username}</b>
        </span>
      </Link>
    </div>
  );

  const authComponent = (
    <div>
      <Login />

      <h3>Or,</h3>
      <p>Enter your details</p>

      <Signup />
    </div>
  );

  /**
   * Checks if the metamask is connected or not, else shows the ConnectMM component,
   * which lets users to connect the app to their metamask account.
   */
  const mmConnectComp =
    isMMConnected === true ? (
      "Your MetaMask account is already connected with our app.."
    ) : (
      <ConnectMM />
    );

  const notLoggedInComp =
    isMMInstalled === true ? (
      <div>
        {/**
         * If metamask is installed, show the connect button if it is not connected
         * Also show the auth component for login/signup..
         */}
        {mmConnectComp}
        {authComponent}
      </div>
    ) : (
      <p>
        Please install MetaMask extension in your browser to continue the signin
        process..
      </p>
    );

  return (
    <div class={style.auth}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "blue" }}>{message}</p>}

      <h1>Auth Page</h1>

      {/**
       * If user is logged in, then show him the link to his profile,
       * else, show him the not logged in component..
       *
       * Not logged in component checks if metamask is installed or not,
       * and if it is installed, then show him the metamask connect stuff as well as the login component,
       * else show him the error that metamask is not installed, so we cannot do sign in.
       */}
      {isLoggedIn === true ? profileRedirectComponent : notLoggedInComp}
    </div>
  );
}
