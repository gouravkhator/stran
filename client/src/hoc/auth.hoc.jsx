import { useDispatch, useSelector } from "react-redux";
import { getUserByToken } from "../services/user-routes.service";
import { setError, setUser } from "../store/actions";

import { useEffect, useState } from "preact/hooks";

import Redirect from "../components/Redirect";

/**
 * A higher-order component to firstly take in the component to be wrapped.
 *
 * It then checks if redux store has the user or not, else it fetches the user via token from server.
 *
 * Then, once we have fetched the user if token was valid, or we have the user already in redux store,
 * we render the component, based on the options passed.
 *
 * This HOC also solves one more problem, which is when the user directly travels to /profile for example,
 * which is a restricted route, then it should first fetch user by token and then only show the profile route.
 *
 * @param {*} Component Component to be wrapped
 * @param {*} requiresLogin If Login is required before rendering the component
 * @param {*} requiresErrorDisplay If some component does not want any errors to be displayed like Header component.
 *
 * By default, it is set to true, as most components need the errors display feature.
 * @returns The wrapped Higher Order component, with user fetched if any, and the component rendered..
 */
export function withAuthHOC(
  Component,
  requiresLogin = true,
  requiresErrorDisplay = true,
) {
  return () => {
    const [fetched, setFetched] = useState(false);

    const user = useSelector(({ user }) => user.userdata);
    const isLoggedIn = useSelector(({ user }) => user.loggedIn);

    const dispatch = useDispatch();

    useEffect(() => {
      (async () => {
        if (!!user.username) {
          // if user is already there in redux store, then don't fetch it from server..
          setFetched(() => true);
          return;
        }

        try {
          /**
           * TODO: Use localstorage/some other storage for saving and fetching user details from it,
           * and remove that data every 2 mins or so, which can help reduce this get user by token request to the server..
           */

          const userFromToken = await getUserByToken();

          if (!!userFromToken?.username) {
            // token is valid, and we fetched the user using the JWT token itself
            dispatch(setError(null));
            dispatch(setUser(userFromToken));
          }

          setFetched(() => true);
        } catch (err) {
          // even if some thing throwed some error, the state of the data should be set to fetched..
          // after the state is set to fetched, then the loggedIn state is checked and accordingly it acts upon that
          setFetched(() => true);

          if (!err) {
            return;
          }

          if (requiresErrorDisplay) {
            // if error exists and the component requires error to be displayed..
            dispatch(
              setError(
                err.errorMsg ??
                  "Cannot authenticate you in, due to some internal error. Please try after sometime.",
              ),
            );
          }
        }
      })();
    }, []);

    /**
     * If login is required, then check if loggedin, then only render the component,
     * else redirect to /signin.
     *
     * If login is not required, then directly render the component.
     */
    const loginConditionalRender = requiresLogin ? (
      isLoggedIn ? (
        <Component />
      ) : (
        <Redirect to="/signin" />
      )
    ) : (
      <Component />
    );

    return (
      <>
        {fetched ? (
          <div>{loginConditionalRender}</div>
        ) : (
          <div>
            <p>
              We are validating the current user session. Please wait for few
              moments.
            </p>
          </div>
        )}
      </>
    );
  };
}
