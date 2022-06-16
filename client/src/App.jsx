/** @jsx h */
import { h } from "preact";

/**
 * preact-router is not compatible with react-router, and it provides a whole new approach to do routing..
 * check this repo for more details: https://github.com/preactjs/preact-router#preact-router
 */
import { Router } from "preact-router";
import AsyncRoute from "preact-async-route";

import Header from "./components/Header";

// Code-splitting is automated for `routes` directory
import Home from "./routes/Home";
import ErrorPage from "./routes/ErrorPage";

import { Provider, useDispatch } from "react-redux";
import store from "./store/store";
import { setError, setMessage } from "./store/actions";

export function App() {
  const dispatch = useDispatch();

  const handleRouteChange = (event) => {
    // reset the error and message state, when the route changes
    // this is done, as the error and message states are intentionally to be maintained 'per-page' only
    dispatch(setError(null));
    dispatch(setMessage(null));
  };

  return (
    <div id="app">
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

        <ErrorPage errorCode="404" default />
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
