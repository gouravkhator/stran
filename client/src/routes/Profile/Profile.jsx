/** @jsx h */
import { h } from "preact";
import { useSelector } from "react-redux";
import style from "../../styles/profile.module.scss";

import { withAuthHOC } from "../../hoc/auth.hoc";
import { Link } from "preact-router";
import ProfileLogic from "./Profile.logic";

/**
 * ProfileBase is the Profile component without the auth HOC wrapper.
 */
const ProfileBase = () => {
  const user = useSelector(({ user }) => user.userdata);
  const { deleteAccount } = ProfileLogic();

  return (
    <div class={style.profile}>
      <h1>Hello {user.username}!!</h1>

      <p>Currently, we see that your status is set as {user.status}</p>
      <p>Your preferred language is {user.primaryLanguage}</p>
      <p>Your location is {user.location}</p>
      <p>Your userid is {user.userid}</p>

      <article id="delete-section">
        <p>
          No longer wanna be Stran?? That is Sad :(
          <br />I won't force you to stay in this awesome community.
        </p>

        <Link href="/" onClick={deleteAccount}>
          Delete Account
        </Link>
      </article>
    </div>
  );
};

/**
 * Profile component envelopes the ProfileBase component, with the auth HOC,
 * requiring the loggedIn state and also the error to be displayed
 */
const Profile = withAuthHOC(ProfileBase, true, true);

export default Profile;
