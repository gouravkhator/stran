import reducer from "./reducers/root.reducer";
import { createStore, applyMiddleware, compose } from "redux";

/**
 * composeEnhancers is needed to enable the devtools for Redux
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * Global Redux store
 */
const store = createStore(reducer, composeEnhancers(applyMiddleware()));

export default store;
