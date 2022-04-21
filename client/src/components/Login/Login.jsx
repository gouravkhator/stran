/** @jsx h */
import { h } from "preact";
import { withAuthHOC } from "../../hoc/auth.hoc.jsx";
import LoginLogic from "./Login.logic.jsx";

const Login = withAuthHOC(
  () => {
    const { loading, handleLogin } = LoginLogic();

    return (
      <div>
        <button disabled={loading} onClick={handleLogin}>
          Login with MetaMask
        </button>
      </div>
    );
  },
  false,
  true,
);
/**
 * Login component requires error display,
 * but it can be rendered without the logged in state too
 */

export default Login;
