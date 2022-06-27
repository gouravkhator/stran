/** @jsx h */
import { h } from "preact";

/**
 * preact-router is not compatible with react-router, and it provides a whole new approach to do routing..
 * check this repo for more details: https://github.com/preactjs/preact-router#preact-router
 */
import { route, Router } from "preact-router";
import AsyncRoute from "preact-async-route";

import Header from "./components/Header";

// Code-splitting is automated for `routes` directory
import Home from "./routes/Home";
import ErrorPage from "./routes/ErrorPage";

import { Provider, useDispatch } from "react-redux";
import { setError, setMessage } from "./store/actions";
import store from "./store/store";

export function App() {
  const dispatch = useDispatch();

  /**
   * Performs health check on server and routes back to 503 page if there is any issue.
   */
  const performHealthCheckOnServer = async () => {
    try {
      const result = await fetch("http://localhost:8081/healthcheck");

      if (result.status === 503) {
        route("/503", true);
      }
    } catch (err) {
      // err mostly came when the fetch to the server was unsuccessful, meaning server was itself down.
      route("/503", true);
    }
  };

  const handleRouteChange = async (event) => {
    // reset the error and message state, when the route changes
    // this is done, as the error and message states are intentionally to be maintained 'per-page' only
    dispatch(setError(null));
    dispatch(setMessage(null));

    performHealthCheckOnServer(); // perform health check on server, on route change
  };

  return (
    <div id="app" class="container">
      <Header />

      <Router onChange={(event) => handleRouteChange(event)}>
        <Home path="/" />

        <AsyncRoute
          path="/signin"
          // lazy loading the component
          getComponent={() =>
            import("./routes/AuthPage").then((module) => module.default)
          }
        />

        <AsyncRoute
          path="/profile"
          // lazy loading the component
          getComponent={() =>
            import("./routes/Profile/Profile").then((module) => module.default)
          }
        />

        <AsyncRoute
          path="/call"
          // lazy loading the component
          getComponent={() =>
            import("./routes/VideoCall/VideoCall").then(
              (module) => module.default,
            )
          }
        />

        <AsyncRoute
          path="/call/:callId"
          // lazy loading the component
          getComponent={() =>
            import("./routes/CurrCallPage/CurrCallPage").then(
              (module) => module.default,
            )
          }
        />

        <ErrorPage path="/503" errorCode={503} errorMessage="Service Unavailable" />

        <ErrorPage errorCode={404} default />
      </Router>
    </div>
  );
}

/**
 * AppWrapper is a wrapper component around the App component.
 * It wraps the App component with the redux store, and other provider if any..
 */
export function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
