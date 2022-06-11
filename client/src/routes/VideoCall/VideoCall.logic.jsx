import Peer from "peerjs";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { useSelector, useDispatch } from "react-redux";

import { v4 as uuidv4 } from "uuid";

import {
  answerCall,
  callPeer,
  monitorCallEnd,
  monitorIncomingCall,
} from "../../services/peerjs.service";

import {
  setPeerConn,
  setLocalStream,
  setIsInCall,
  setMicOn,
  setWebcamOn,
  setError,
  setMessage,
  setIsCaller,
  setIsCallee,
} from "../../store/actions";

import { captureStream } from "../../utils/video_stream.util";

export default function VideoCallLogic() {
  const user = useSelector(({ user }) => user.userdata);

  const peerConn = useSelector(({ call }) => call.peerConn);
  const localStream = useSelector(({ call }) => call.localStream);

  const micOn = useSelector(({ call }) => call.micOn);
  const webcamOn = useSelector(({ call }) => call.webcamOn);

  const currCall = useSelector(({ call }) => call.currCall);

  const dispatch = useDispatch();

  const [destId, setDestId] = useState("");

  const peerjsConfguration = {
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // {urls: 'turn:user@turn.bistri.com:80', credential: 'usercredential'}
      ],
    },
  };

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

  // -----------Creates the peer server----------------------
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

    dispatch(setError(null));
    dispatch(setMessage(null));

    // if we don't pass the userid, it creates its own unique id..
    const peer = new Peer(user.userid, peerjsConfguration);

    peer.on("open", (id) => {
      console.log("Congrats! You are a peer in this video-calling dapp");
      console.info("Your id is: " + id);
      dispatch(setPeerConn(peer));
    });
  }, []);

  // --------------Capture the local stream and also monitor incoming calls-------------
  useEffect(() => {
    if (!peerConn) {
      return;
    }

    dispatch(setError(null));
    dispatch(setMessage(null));

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

    monitorIncomingCall({
      peer: peerConn,
    });
  }, [peerConn]);

  useEffect(() => {
    monitorCallEnd({ currCall });
  }, [currCall]);

  const initiateCallToDest = () => {
    dispatch(setError(null));
    dispatch(setMessage(null));

    callPeer({ peerConn, destId, localStream });

    route(`/call/${currCall?.connectionId || ""}`); // ? NOTE: can have issues
  };

  const answerCallWrapper = (call) => {
    dispatch(setError(null));
    dispatch(setMessage(null));

    answerCall({
      incomingCall: call,
      localStream,
    });

    route(`/call/${currCall?.connectionId || ""}`); // route to the call page link
  };

  const endCall = () => {
    currCall.close(); // !ISSUE: some issues I think, as the other end's call is not ending when I end my call
    dispatch(setIsInCall(false)); // this ends the call from current user side only
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
