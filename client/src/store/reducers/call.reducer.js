import { callActions } from "../actions";

const initialState = {
  peerConn: null,
  localStream: null,
  remoteStream: null,
  micOn: true,
  webcamOn: true,
  currCall: null,
  isCallee: false,
  isCaller: false,
  isAnswering: false,
  inCall: false,
};

const callReducer = (state = initialState, action) => {
  switch (action.type) {
    case callActions.SET_PEER_CONN:
      return {
        ...state,
        peerConn: action.peerConn,
      };
    case callActions.RESET_PEER_CONN:
      return {
        ...state,
        peerConn: initialState.peerConn,
      };
    case callActions.SET_LOCAL_STREAM:
      return {
        ...state,
        localStream: action.localStream,
      };
    case callActions.SET_REMOTE_STREAM:
      return {
        ...state,
        remoteStream: action.remoteStream,
      };
    case callActions.SET_MIC_ON:
      return {
        ...state,
        micOn: true,
      };
    case callActions.SET_MIC_OFF:
      return {
        ...state,
        micOn: false,
      };
    case callActions.SET_WEBCAM_ON:
      return {
        ...state,
        webcamOn: true,
      };
    case callActions.SET_WEBCAM_OFF:
      return {
        ...state,
        webcamOn: false,
      };
    case callActions.SET_CURR_CALL:
      return {
        ...state,
        currCall: action.currCall,
      };
    case callActions.RESET_CURR_CALL:
      return {
        ...state,
        currCall: initialState.currCall,
      };
    case callActions.SET_IS_CALLER:
      return {
        ...state,
        isCaller: true,
        isCallee: false,
      };
    case callActions.SET_IS_NOT_CALLER:
      return {
        ...state,
        isCaller: false,
      };
    case callActions.SET_IS_CALLEE:
      return {
        ...state,
        isCallee: true,
        isCaller: false,
      };
    case callActions.SET_IS_NOT_CALLEE:
      return {
        ...state,
        isCallee: false,
      };
    case callActions.SET_IS_ANSWERING:
      return {
        ...state,
        isAnswering: true,
        /**
         * here, if user clicked on answer, he will answer the call,
         * and so we need to maintain the currCall object too,
         * which contains info of the call
         *
         * We cannot reset the currCall state now, but we will reset it when inCall is set to true.
         */
      };
    case callActions.SET_NOT_IS_ANSWERING:
      return {
        ...state,
        isAnswering: false,
        currCall: null,
        remoteStream: null,
      };
    case callActions.SET_IN_CALL:
      return {
        ...state,
        inCall: true,
        isAnswering: false,
      };
    case callActions.SET_NOT_IN_CALL:
      return {
        ...state,
        inCall: false,
        isAnswering: false,
        currCall: null,
        remoteStream: null,
        isCaller: false,
        isCallee: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default callReducer;
