import { combineReducers } from "redux";
import globalReducer from "./global.reducer";
import userReducer from "./user.reducer";
import counterReducer from "./counter.reducer";
import metamaskReducer from "./metamask.reducer";

export default combineReducers({
  user: userReducer,
  metamask: metamaskReducer,
  global: globalReducer,
  counter: counterReducer,
});
