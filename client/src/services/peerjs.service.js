import Peer from "peerjs";

import {
  setPeerConn,
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
import { getRandomAvailableUser } from "./other-user-routes.service";

export const peerjsConfguration = {
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      // {urls: 'turn:user@turn.bistri.com:80', credential: 'usercredential'}
    ],
  },
};

export function openPeerConnection({ userid }) {
  // if we don't pass the userid in the Peer constructor, it creates its own unique id..
  const peer = new Peer(userid, peerjsConfguration);

  // on opening of the peer
  peer.on("open", (id) => {
    // "open" event is emitted when the connection to the peer server is established..
    console.log("Congrats! You are a peer in this video-calling dapp");
    console.info("Your id is: " + id); // this id is same as the id passed in Peer constructor above
    store.dispatch(setPeerConn(peer));
  });

  peer.on("connection", (conn) => {
    // "connection" event is emitted when a new data connection is established from remote peer
    conn.on("close", () => {
      manualConnectionClose({ peer });
      store.dispatch(setIsInCall(false));
    });

    conn.on("error", (err) => {
      // TODO: set the error here, if there is some issues in the connection
    });
  });

  peer.on("disconnected", () => {
    // "disconnected" event is emitted when the peer is disconnected from the signalling server
    // TODO: set the error here, that current user got disconnected
  });
}

export function monitorIncomingCall({ peer }) {
  if (!peer) {
    return; // TODO: throw some error
  }

  peer.on("call", async function (call) {
    // "call" event is emitted when a remote peer attempts to call you
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

export async function callPeer({
  peerConn,
  localStream,
  destId,
  isCalleeRandom = false,
}) {
  try {
    if (!peerConn || !localStream) {
      return; // TODO: throw some error
    }

    if (isCalleeRandom === true) {
      // getting the random available user
      destId = await getRandomAvailableUser();
    }

    const call = peerConn.call(destId, localStream);

    store.dispatch(setCurrCall(call));
    store.dispatch(setIsCaller(true));

    call.on("stream", function (remoteStream) {
      store.dispatch(setRemoteStream(remoteStream));
      store.dispatch(setIsInCall(true));
    });

    // !ISSUE: if user's status is available, but he is not receiving the call, then just set curr call to null, and reset all
  } catch (err) {
    throw err;
  }
}

export function manualConnectionClose({ peer }) {
  // manually close the peer connections
  for (let conns in peer.connections) {
    peer.connections[conns].forEach((conn, index, array) => {
      console.log(
        `closing ${conn.connectionId} peerConnection (${index + 1}/${
          array.length
        })`,
        conn.peerConnection,
      );

      conn.peerConnection.close(); // !ISSUE: on incoming call, when we try to close this, it throws error like conn.peerConnection is null
      // We have to make sure that when we close, the other side knows that we are ending the incoming call also

      // close it using peerjs methods
      if (conn.close) conn.close();
    });
  }
}

export function monitorCallEnd({ currCall }) {
  if (!currCall) {
    return; // TODO: throw some error
  }

  currCall.on("close", function () {
    store.dispatch(setIsInCall(false));
  });
}
