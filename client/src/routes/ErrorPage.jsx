/** @jsx h */
import { h } from "preact";
import style from "../styles/error.module.scss";

// url is not even passed as params by us explicitly, it is passed automatically
const ErrorPage = ({ errorCode, url }) => (
  <div class={style.error}>
    <h2>Error {type}</h2>
    <p>It looks like we hit a snag.</p>
    <pre>{url}</pre>
  </div>
);

export default ErrorPage;
