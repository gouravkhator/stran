/** @jsx h */
import { h } from "preact";
import style from "../styles/home.module.scss";

import { Link } from "preact-router";
import ErrorNSuccess from "../components/ErrorNSuccess";

const Home = () => {
  return (
    <div class={style.home}>
      <ErrorNSuccess />

      <h1>Home Page</h1>
      <h2>Getting bOreD??</h2>
      <Link href="/call">Get Set Calling</Link>
    </div>
  );
};

export default Home;
