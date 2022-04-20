/** @jsx h */
import { h } from "preact";
import { useSelector } from "react-redux";
import style from "../styles/home.module.scss";

import { Link } from "preact-router";

const Home = () => {
  const error = useSelector(({ global }) => global.error);
  const message = useSelector(({ global }) => global.message);

  return (
    <div class={style.home}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "blue" }}>{message}</p>}

      <h1>Home Page</h1>
      <h2>Getting bOreD??</h2>

      <Link href="/call">Get Set Calling</Link>
    </div>
  );
};

export default Home;
