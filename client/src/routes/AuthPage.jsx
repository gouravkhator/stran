/** @jsx h */
import { h } from "preact";
import style from "../styles/auth.module.scss";
import { useSelector } from "react-redux";
import { Link } from "preact-router/match";

import Login from "../components/Login/Login";
import SignupForm from "../components/SignupForm/SignupForm";

import { useMetamask } from "../custom-hooks/MetamaskCustomHooks";
import { signupHandler } from "../services/user-auth.service.js";

const AuthPage = () => {
  useMetamask();

  const error = useSelector(({ global }) => global.error);
  const isMMInstalled = useSelector(({ metamask }) => metamask.isInstalled);
  const isLoggedIn = useSelector(({ user }) => user.loggedIn);
  const user = useSelector(({ user }) => user.userdata);

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

      <SignupForm
        signupHandler={({ publicAddress, name }) =>
          signupHandler({ publicAddress, name })
        }
      />
    </div>
  );

  const notLoggedInComp =
    isMMInstalled === true ? (
      authComponent
    ) : (
      <p>
        Please install MetaMask extension in your browser to continue the signin
        process..
      </p>
    );

  return (
    <div class={style.auth}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h1>Auth Page</h1>

      {/**
       * If user is logged in, then show him the link to his profile,
       * else, show him the not logged in component..
       *
       * Not logged in component checks if metamask is installed or not,
       * and if it is installed, then show him the login component,
       * else show him the error that metamask is not installed, so we cannot do sign in.
       */}
      {isLoggedIn === true ? profileRedirectComponent : notLoggedInComp}
    </div>
  );
};

export default AuthPage;
