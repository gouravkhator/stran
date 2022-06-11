/*-----Action names as objects-----*/
// ? NOTE: we use Object.freeze for those action names, so that these actions cannot be changed anywhere..

export const callActions = Object.freeze({
  SET_PEER_CONN: "SET_PEER",
  RESET_PEER_CONN: "RESET_PEER",
  SET_LOCAL_STREAM: "SET_LOCAL_STREAM",
  SET_REMOTE_STREAM: "SET_REMOTE_STREAM",
  SET_MIC_ON: "SET_MIC_ON",
  SET_MIC_OFF: "SET_MIC_OFF",
  SET_WEBCAM_ON: "SET_WEBCAM_ON",
  SET_WEBCAM_OFF: "SET_WEBCAM_OFF",
  SET_CURR_CALL: "SET_CURR_CALL",
  RESET_CURR_CALL: "RESET_CURR_CALL",
  SET_IS_CALLER: "SET_IS_CALLER",
  SET_IS_NOT_CALLER: "SET_IS_NOT_CALLER",
  SET_IS_CALLEE: "SET_IS_CALLEE",
  SET_IS_NOT_CALLEE: "SET_IS_NOT_CALLEE",
  SET_IS_ANSWERING: "SET_IS_ANSWERING",
  SET_NOT_IS_ANSWERING: "SET_NOT_IS_ANSWERING",
  SET_IN_CALL: "SET_IN_CALL",
  SET_NOT_IN_CALL: "SET_NOT_IN_CALL",
});

/*-----Action Object generator functions----- */

export const setPeerConn = (peerConn = null) => {
  if (!peerConn) {
    // peer connection passed is null
    return {
      type: callActions.RESET_PEER_CONN,
    };
  } else {
    return {
      type: callActions.SET_PEER_CONN,
      peerConn,
    };
  }
};

export const setLocalStream = (localStream = null) => {
  if (!localStream) {
    // localstream passed is null
    return {
      type: callActions.SET_LOCAL_STREAM,
      localStream: null,
    };
  } else {
    return {
      type: callActions.SET_LOCAL_STREAM,
      localStream,
    };
  }
};

export const setRemoteStream = (remoteStream = null) => {
  if (!remoteStream) {
    // remoteStream passed is null
    return {
      type: callActions.SET_REMOTE_STREAM,
      remoteStream: null,
    };
  } else {
    return {
      type: callActions.SET_REMOTE_STREAM,
      remoteStream,
    };
  }
};

export const setMicOn = (micState = false) => {
  if (!micState || micState === false) {
    // mic state passed is null, or is false
    return {
      type: callActions.SET_MIC_OFF,
    };
  } else {
    return {
      type: callActions.SET_MIC_ON,
    };
  }
};

export const setWebcamOn = (webcamState = false) => {
  if (!webcamState || webcamState === false) {
    // webcam state passed is null, or is false
    return {
      type: callActions.SET_WEBCAM_OFF,
    };
  } else {
    return {
      type: callActions.SET_WEBCAM_ON,
    };
  }
};

export const setCurrCall = (currCall = null) => {
  if (!currCall) {
    // currCall passed is null
    return {
      type: callActions.RESET_CURR_CALL,
    };
  } else {
    return {
      type: callActions.SET_CURR_CALL,
      currCall,
    };
  }
};

export const setIsCaller = (isCaller = true) => {
  if (isCaller !== true) {
    return {
      type: callActions.SET_IS_NOT_CALLER,
    };
  } else {
    return {
      type: callActions.SET_IS_CALLER,
    };
  }
};

export const setIsCallee = (isCallee = true) => {
  if (isCallee !== true) {
    return {
      type: callActions.SET_IS_NOT_CALLEE,
    };
  } else {
    return {
      type: callActions.SET_IS_CALLEE,
    };
  }
};

export const setIsAnswering = (isAnswering = false) => {
  if (!isAnswering || isAnswering === false) {
    // isAnswering passed is null, or false
    return {
      type: callActions.SET_NOT_IS_ANSWERING,
    };
  } else {
    return {
      type: callActions.SET_IS_ANSWERING,
    };
  }
};

export const setIsInCall = (inCall = false) => {
  if (!inCall || inCall === false) {
    // inCall passed is null or is false
    return {
      type: callActions.SET_NOT_IN_CALL,
    };
  } else {
    return {
      type: callActions.SET_IN_CALL,
    };
  }
};
