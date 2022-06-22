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
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div class="container-fluid">
          
          <Link class="navbar-brand" href="/">
            Stran
          </Link>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link
                  class="nav-link"
                  aria-current="page"
                  activeClassName="active"
                  href="/"
                >
                  Home
                </Link>
              </li>

              {!user?.username ? (
                <li class="nav-item">
                  <Link
                    class="nav-link"
                    aria-current="page"
                    activeClassName="active"
                    href="/signin"
                  >
                    SignIn
                  </Link>
                </li>
              ) : (
                <>
                  <li class="nav-item">
                    <Link
                      class="nav-link"
                      aria-current="page"
                      activeClassName="active"
                      href="/profile"
                    >
                      Profile
                    </Link>
                  </li>

                  <li class="nav-item">
                    <Link
                      class="nav-link"
                      aria-current="page"
                      href="/"
                      onClick={onSignoutClick}
                    >
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <nav class="navbar navbar-light" style="background-color: #e3f2fd;">
        <div class="container-fluid"></div>
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
