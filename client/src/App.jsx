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
import { createStore } from "redux";

const store = createStore(reducer);

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

        <Profile path="/profile/" user="me" />
        <Profile path="/profile/:user" />
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
