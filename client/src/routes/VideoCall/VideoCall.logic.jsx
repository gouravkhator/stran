import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { useSelector, useDispatch } from "react-redux";

import {
  answerCall,
  callPeer,
  manualConnectionClose,
  monitorIncomingCall,
  openPeerConnection,
} from "../../services/peerjs.service";

import {
  setLocalStream,
  setIsInCall,
  setMicOn,
  setWebcamOn,
  setError,
  setMessage,
} from "../../store/actions";

import { captureStream } from "../../utils/video_stream.util";

export default function VideoCallLogic() {
  const dispatch = useDispatch();

  const user = useSelector(({ user }) => user.userdata);

  const peerConn = useSelector(({ call }) => call.peerConn);
  const localStream = useSelector(({ call }) => call.localStream);
  const currCall = useSelector(({ call }) => call.currCall);

  const micOn = useSelector(({ call }) => call.micOn);
  const webcamOn = useSelector(({ call }) => call.webcamOn);

  const [destId, setDestId] = useState("");

  /*------------------Extra Functions------------------*/
  /**
   * Captures stream and sets it to localStream, if localStream is null..
   *
   * captureStreamIfNotPresent is a expression for the function,
   * and so, to use it in useEffect blocks, we have to declare it above useEffect
   */
  const captureStreamIfNotPresent = async () => {
    if (localStream === null) {
      const stream = await captureStream();
      dispatch(setLocalStream(stream));
    }
  };

  /*------------------Side Effects------------------*/
  /**
   * ?NOTE: No need to reset errors and success messages in the side effects functionalities,
   * as this VideoCall.logic.jsx is used in multiple components
   *
   * Those reset of errors and messages are done in the call initiation, or before answering the call.
   */

  // Creating the connection to the peer server, if peer connection not already created
  useEffect(() => {
    /**
     * ! ISSUE: Public Peer server gets down sometimes..
     * This peer connection connects to a public peer server, but sometimes that peer server is down..
     * If we need to have the peer server running always, we need to host our own.
     */

    if (peerConn !== null) {
      // if we have the peer connection already in place in Redux state, we don't create another one..
      return;
    }

    // create a connection with the given userid, and this method also sets the peerConn global state
    openPeerConnection({ userid: user.userid });
  }, []);

  // Captures the local stream and also monitors the incoming calls
  useEffect(() => {
    if (!peerConn) {
      return; // TODO: set some error here, as the peer connection should be present till now
    }

    try {
      (async () => {
        await captureStreamIfNotPresent(); // gets the video and audio on, when we get to the video call page
      })();
    } catch (err) {
      dispatch(
        setMessage(
          "Please select proper webcam and audio device for video calling.",
        ),
      );
    }

    // to constantly monitor any incoming call, and set respective states accordingly
    monitorIncomingCall({
      peer: peerConn,
    });
  }, [peerConn]);

  /*------------------Logical Functions------------------*/
  const initiateCallToDest = async ({ isCalleeRandom = false }) => {
    // reset errors and messages before calling and going to call page
    dispatch(setError(null));
    dispatch(setMessage(null));

    try {
      if (isCalleeRandom === true) {
        await callPeer({ peerConn, destId, localStream, isCalleeRandom });
      } else {
        // callee is not random, rather its id is provided as destId

        if (destId === user.userid) {
          // check if inputted destId (user to call to) is same as the current user, then we throw error
          dispatch(
            setError(
              "You cannot call your own self.. Please enter valid user id of other person!",
            ),
          );
        } else {
          await callPeer({ peerConn, destId, localStream, isCalleeRandom });
        }
      }

      route(`/call/${currCall?.connectionId || ""}`);
    } catch (err) {
      dispatch(
        setError(
          err.errorMsg ??
            "Unable to initiate call to any of the stran! Please try after sometime!!",
        ),
      );
    }
  };

  const answerCallWrapper = (call) => {
    // reset errors and messages before answering the call and going to call page
    dispatch(setError(null));
    dispatch(setMessage(null));

    answerCall({
      incomingCall: call,
      localStream,
    });

    route(`/call/${currCall?.connectionId || ""}`); // route to the call page link
  };

  const endCall = () => {
    manualConnectionClose({ peer: peerConn }); // !ISSUE: some issues I think, as the other end's call is not ending when I end my call
    dispatch(setIsInCall(false)); // this sets the inCall to false
    route("/call", true); // when I end the call I will route back to the main call page
  };

  const handleDestIdInput = (event) => {
    setDestId((oldDestId) => event.target.value);
  };

  const toggleMic = async () => {
    await captureStreamIfNotPresent();

    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (micOn === true) {
      // turn the mic off, meaning disable the audio tracks of the local stream
      dispatch(setMicOn(false));
      audioTrack.enabled = false;
    } else {
      dispatch(setMicOn(true));
      audioTrack.enabled = true; // enable the audio track..
    }
  };

  const toggleWebcam = async () => {
    await captureStreamIfNotPresent();

    const videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    if (webcamOn === true) {
      // turn the webcam off, meaning disable the video tracks of the local stream
      dispatch(setWebcamOn(false));
      videoTrack.enabled = false;
    } else {
      dispatch(setWebcamOn(true));
      videoTrack.enabled = true; // enable the video track..
    }
  };

  return {
    initiateCallToDest,
    handleDestIdInput,
    toggleMic,
    toggleWebcam,
    answerCallWrapper,
    endCall,
  };
}
