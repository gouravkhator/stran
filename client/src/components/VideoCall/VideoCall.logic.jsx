import Peer from "peerjs";
import { useEffect, useState } from "preact/hooks";
import { useSelector } from "react-redux";
import { callPeer, answerCall } from "../../services/peerjs.service";
import { captureStream } from "../../utils/video_stream.util";

export default function VideoCallLogic() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConn, setPeerConn] = useState(null);

  // TODO: set the incoming call state, so that we can use that to have a UI that a person is calling..
  const [incomingCall, setIncomingCall] = useState(false);

  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);

  const user = useSelector(({ user }) => user.userdata);

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
      setLocalStream((prevLocalStream) => stream);
    }
  };

  useEffect(() => {
    /**
     * ! ISSUE: Public Peer server gets down sometimes..
     * This peer connection connects to a public peer server, but sometimes that peer server is down..
     * If we need to have the peer server running always, we need to host our own.
     */

    // if we don't pass the userid, it creates its own unique id..
    const peer = new Peer(user.userid, peerjsConfguration);

    peer.on("open", (id) => {
      console.log("Congrats! You are a peer in this video-calling dapp");
      console.info("Your id is: " + id);
      setPeerConn((oldPeerConn) => peer);
    });
  }, []);

  useEffect(() => {
    if (!peerConn) {
      return;
    }

    (async () => {
      await captureStreamIfNotPresent(); // gets the video and audio on, when we get to the video call page
    })();

    answerCall({
      peer: peerConn,
      setIncomingCall,
      setLocalStream,
      setRemoteStream,
    });
  }, [peerConn]);

  const initiateCall = async () => {
    await callPeer({ peer: peerConn, destId, setLocalStream, setRemoteStream });
  };

  const handleDestIdInput = (event) => {
    setDestId((oldDestId) => event.target.value);
  };

  const toggleMic = async () => {
    await captureStreamIfNotPresent();

    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (webcamOn === true) {
      // turn the webcam off, meaning disable the video tracks of the local stream
      audioTrack.enabled = false;
    } else {
      audioTrack.enabled = true; // enable the video track..
    }

    setMicOn((micOn) => !micOn);
  };

  const toggleWebcam = async () => {
    await captureStreamIfNotPresent();

    const videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    if (webcamOn === true) {
      // turn the webcam off, meaning disable the video tracks of the local stream
      videoTrack.enabled = false;
    } else {
      videoTrack.enabled = true; // enable the video track..
    }

    setWebcamOn((webcamOn) => !webcamOn);
  };

  return {
    peerConn,
    initiateCall,
    localStream,
    remoteStream,
    handleDestIdInput,
    micOn,
    toggleMic,
    webcamOn,
    toggleWebcam,
    captureStreamIfNotPresent,
  };
}
