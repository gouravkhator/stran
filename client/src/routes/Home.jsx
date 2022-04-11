/** @jsx h */
import { h } from "preact";
import style from "../styles/home.module.scss";
import VideoCall from "../components/VideoCall/VideoCall";
import Counter from "../components/Counter/Counter";
import { useSelector } from "react-redux";

const Home = () => {
  const error = useSelector(({ global }) => global.error);

  return (
    <div class={style.home}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h1>Home Page</h1>
      <Counter />
      {/* Commented the VideoCall Component, to only include that in the calling page */}
      {/* <VideoCall /> */}
    </div>
  );
};

export default Home;
