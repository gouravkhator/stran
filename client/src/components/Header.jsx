/** @jsx h */
import { h } from "preact";
import { Link } from "preact-router/match";
import { useDispatch, useSelector } from "react-redux";

import style from "../styles/header.module.scss";
import { logoutHandler } from "../services/user-auth.service";
import { setError } from "../store/actions";
import { withAuthHOC } from "../hoc/auth.hoc";

const Header = withAuthHOC(() => {
  const user = useSelector(({ user }) => user.userdata);
  const dispatch = useDispatch();

  const onSignoutClick = async () => {
    try {
      await logoutHandler();
    } catch (err) {
      dispatch(setError("Could not logout!! Please try after sometime.."));
    }
  };

  return (
    <header class={style.header}>
      <h1>Preact App</h1>
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
}, false, false);
// Header component does not require login to be rendered or any error display
// so passing false to both those params.. 

export default Header;
