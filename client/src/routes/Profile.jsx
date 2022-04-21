/** @jsx h */
import { h } from "preact";
import { useSelector } from "react-redux";
import style from "../styles/profile.module.scss";

import { withAuthHOC } from "../hoc/auth.hoc";

const Profile = withAuthHOC(
  () => {
    const user = useSelector(({ user }) => user.userdata);
    const isLoggedIn = useSelector(({ user }) => user.loggedIn);

    return (
      <div class={style.profile}>
        <h1>Hello {user.username}!!</h1>

        <p>Currently, we see that your status is set as {user.status}</p>
        <p>Your preferred language is {user.primaryLanguage}</p>
        <p>Your location is {user.location}</p>
        <p>Your userid is {user.userid}</p>
      </div>
    );
  },
  true,
  true,
);
/**
 * Profile component requires the loggedIn state and also the error display 
 */

export default Profile;
