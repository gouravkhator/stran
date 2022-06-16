/** @jsx h */
import { h } from "preact";
import style from "../styles/home.module.scss";

import { Link } from "preact-router";
import { useDispatch, useSelector } from "react-redux";
import { setBannerMsg } from "../store/actions";
import { useEffect } from "preact/hooks";

const Home = () => {
  // banner message is being used to be shown in the home page only
  const bannerMsg = useSelector(({ global }) => global.bannerMsg);
  const dispatch = useDispatch();

  // setting the timeout for the banner message, to be reset to empty string after 5 seconds.
  useEffect(() => {
    if (bannerMsg !== "") {
      setTimeout(() => {
        // this method takes null or undefined or empty string, and makes that bannerMsg to empty string itself..
        dispatch(setBannerMsg(null));
      }, 5000); // 5000 milliseconds or 5 seconds
    }
  }, [bannerMsg]); // just monitor the changes in bannerMsg

  return (
    <div class={style.home}>
      {bannerMsg && <p style={{ color: "blue" }}>{bannerMsg}</p>}

      <h1>Home Page</h1>
      <h2>Getting bOreD??</h2>
      <Link href="/call">Get Set Calling</Link>
    </div>
  );
};

export default Home;
