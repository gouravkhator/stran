/** @jsx h */
import { h } from "preact";
import { useSelector } from "react-redux";
import style from "../styles/profile.module.scss";

import Redirect from "../components/Redirect";

const Profile = () => {
  const isLoggedIn = useSelector(({ user }) => user.loggedIn);
  const user = useSelector(({ user }) => user.userdata);

  return (
    <>
      {!isLoggedIn ? (
        <Redirect to="/signin" />
      ) : (
        <div class={style.profile}>
          <h1>Hello {user.username}!!</h1>

          <p>Currently, we see that your status is set as {user.status}</p>
          <p>Your preferred language is {user.primaryLanguage}</p>
          <p>Your location is {user.location}</p>
          <p>Your userid is {user.userid}</p>
        </div>
      )}
    </>
  );
};

export default Profile;
