import {
  setLocalStream,
  setRemoteStream,
  setCurrCall,
  setIsAnswering,
  setIsInCall,
  setIsCallee,
  setIsCaller,
} from "../store/actions";

import { captureStream } from "../utils/video_stream.util";

/*
In order to dispatch from outside of the scope of Component,
we need to get the store instance and call dispatch on it
*/
import store from "../store/store";

export function monitorIncomingCall({ peer }) {
  if (!peer) {
    return; // TODO: throw some error
  }

  peer.on("call", async function (call) {
    store.dispatch(setCurrCall(call));
    store.dispatch(setIsCallee(true));

    const localStream = await captureStream();
    store.dispatch(setLocalStream(localStream));
  });
}

export function answerCall({ incomingCall, localStream }) {
  if (!incomingCall || !localStream) {
    return; // TODO: throw some error
  }

  // Answer the call, providing our own local mediaStream
  incomingCall.answer(localStream);

  store.dispatch(setIsAnswering(true));
  store.dispatch(setIsCallee(true));

  incomingCall.on("stream", function (remoteStream) {
    store.dispatch(setRemoteStream(remoteStream));
    store.dispatch(setIsInCall(true));
  });
}

export function callPeer({ peerConn, destId, localStream }) {
  if (!peerConn || !localStream) {
    return; // TODO: throw some error
  }

  const call = peerConn.call(destId, localStream);

  store.dispatch(setCurrCall(call));
  store.dispatch(setIsCaller(true));

  call.on("stream", function (remoteStream) {
    store.dispatch(setRemoteStream(remoteStream));
    store.dispatch(setIsInCall(true));
  });
}

export function monitorCallEnd({ currCall }) {
  if (!currCall) {
    return; // TODO: throw some error
  }

  currCall.on("close", function () {
    store.dispatch(setIsInCall(false));
  });
}
