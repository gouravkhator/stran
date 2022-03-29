/** @jsx h */
import { h } from "preact";
import LoginLogic from "./Login.logic.jsx";

// TODO: Login is very much incomplete..
export default function Login() {
  const { loading, handleLogin } = LoginLogic();

  return (
    <div>
      <button disabled={loading} onClick={handleLogin}>
        Login with MetaMask
      </button>
    </div>
  );
}
