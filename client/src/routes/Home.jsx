import { h } from "preact";
import style from "../styles/home.module.scss";
import Calling from "../components/Calling";
import MetamaskLogin from "../components/MetamaskLogin";

const Home = () => {
  return (
    <div class={style.home}>
      <h1>Home Page</h1>
      <MetamaskLogin />
      {/* Commented the Calling Component, to only include that in the calling page */}
      {/* <Calling /> */}
    </div>
  );
};

export default Home;
