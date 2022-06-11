/*-----Action Object generator functions----- */
/*-----Action names as objects-----*/
// ? NOTE: we use Object.freeze for those action names, so that these actions cannot be changed anywhere..

import { userActions, setUser } from "./user.actions";

import {
  callActions,
  setPeerConn,
  setLocalStream,
  setRemoteStream,
  setMicOn,
  setWebcamOn,
  setCurrCall,
  setIsAnswering,
  setIsInCall,
  setIsCallee,
  setIsCaller,
} from "./call.actions";

import {
  metamaskActions,
  setAccount,
  setIsConnected,
  setIsInstalled,
} from "./metamask.actions";

import { globalActions, setError, setMessage } from "./global.actions";

export { userActions, callActions, metamaskActions, globalActions };

export {
  setUser,
  setAccount,
  setIsConnected,
  setIsInstalled,
  setError,
  setMessage,
  setPeerConn,
  setLocalStream,
  setRemoteStream,
  setMicOn,
  setWebcamOn,
  setCurrCall,
  setIsAnswering,
  setIsInCall,
  setIsCallee,
  setIsCaller,
};
