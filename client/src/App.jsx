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
import Profile from "./routes/Profile";
import ErrorPage from "./routes/ErrorPage";

import reducer from "./store/reducers/root.reducer";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

// enable the devtools for Redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// global Redux store
const store = createStore(reducer, composeEnhancers(applyMiddleware()));

export function App() {
  return (
    <div id="app">
      <Header />

      <Router>
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
            import("./routes/Profile").then((module) => module.default)
          }
        />

        <AsyncRoute
          path="/call"
          // lazy loading the component
          getComponent={() =>
            import("./components/VideoCall/VideoCall").then(
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
