/** @jsx h */
import { h } from "preact";
import { Link } from "preact-router/match";
import { useDispatch, useSelector } from "react-redux";

import style from "../styles/header.module.scss";
import { logoutHandler } from "../services/auth-routes.service";
import { setError, setUser } from "../store/actions";
import { withAuthHOC } from "../hoc/auth.hoc";

/**
 * HeaderBase is the Header component with no auth HOC..
 */
const HeaderBase = () => {
  const user = useSelector(({ user }) => user.userdata);
  const dispatch = useDispatch();

  const onSignoutClick = async () => {
    try {
      await logoutHandler();
      dispatch(setUser(null)); // after logging out, set the userdata to null
    } catch (err) {
      if (!err) {
        return;
      }

      dispatch(setError("Could not logout!! Please try after sometime.."));
    }
  };

  return (
    <header class={style.header}>
      <Link href="/">
        <h1>Stran</h1>
      </Link>

      <nav>
        <Link activeClassName={style.active} href="/">
          Home
        </Link>

        {!user?.username ? (
          <Link activeClassName={style.active} href="/signin">
            Sign In
          </Link>
        ) : (
          <>
            <Link
              activeClassName={style.active}
              href="/"
              onClick={onSignoutClick}
            >
              Sign Out
            </Link>
            <Link activeClassName={style.active} href="/profile">
              Profile
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

/**
 * Header component envelopes the HeaderBase component, with the auth HOC,
 * not requiring logged in state and does not require to display any error..
 * so passing false to both those params..
 */
const Header = withAuthHOC(HeaderBase, false, false);

export default Header;
