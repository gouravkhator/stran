import { combineReducers } from "redux";
import globalReducer from "./global.reducer";
import userReducer from "./user.reducer";
import callReducer from "./call.reducer";
import metamaskReducer from "./metamask.reducer";

export default combineReducers({
  user: userReducer,
  metamask: metamaskReducer,
  call: callReducer,
  global: globalReducer,
});
