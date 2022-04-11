/** @jsx h */
import { h } from "preact";
import { Link } from "preact-router/match";
import { useSelector } from "react-redux";
import { useEffect } from "preact/compat";

import style from "../styles/header.module.scss";
import { getUserByToken, logoutHandler } from "../services/user-auth.service";
import { setError, setUser } from "../store/actions";

const Header = () => {
  const user = useSelector(({ user }) => user.userdata);

  useEffect(() => {
    (async () => {
      // if user exists, we don't want to fetch it from the server..
      if (!!user.username) {
        return;
      }

      try {
        const userFromToken = await getUserByToken();

        if (!!userFromToken?.username) {
          // token is valid, and we fetched the user using the JWT token itself
          setUser(userFromToken);
        }
      } catch (err) {
        /**
         * fetch to the server is not working,
         * but as it is the Header component, so we don't show any error here..
         *
         * We will show this kind of error in the user details page or when we need user actually..
         */
      }
    })();
  }, []);

  const onSignoutClick = async () => {
    try {
      await logoutHandler();
    } catch (err) {
      setError("Could not logout!! Please try after sometime..");
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
          <Link
            activeClassName={style.active}
            href="/"
            onClick={() => onSignoutClick()}
          >
            Sign Out
          </Link>
        )}

        <Link activeClassName={style.active} href="/profile">
          Me
        </Link>
        <Link activeClassName={style.active} href="/profile/john">
          John
        </Link>
      </nav>
    </header>
  );
};

export default Header;
