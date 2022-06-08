/** @jsx h */
import { h } from "preact";
import { withAuthHOC } from "../../hoc/auth.hoc";

import VideoCallLogic from "./VideoCall.logic";

/**
 * VideoCallBase is the VideoCall component without the auth HOC wrapper.
 */
const VideoCallBase = () => {
  const {
    peerConn,
    initiateCall,
    localStream,
    remoteStream,
    handleDestIdInput,
    micOn,
    toggleMic,
    webcamOn,
    toggleWebcam,
  } = VideoCallLogic();

  const iconSize = "30";

  return (
    <div>
      <h2>Wanna Know some Unknown Strans??</h2>
      <h3>Go check them out with a single click right below..</h3>

      {peerConn?._id && <h3>Your id: {peerConn._id}</h3>}

      <button onClick={initiateCall}>Call</button>

      <input onChange={handleDestIdInput} />
      <br />
      <h2>Local Video</h2>
      <video
        id="localstream"
        autoPlay
        muted={true} // to keep out own video muted (no sound)
        style={{ width: "40%" }}
        ref={(video) => {
          if (video !== null && localStream) video.srcObject = localStream;
        }}
      ></video>

      <h2>Remote Video</h2>
      <video
        id="remotestream"
        autoPlay
        style={{ width: "40%" }}
        ref={(video) => {
          if (video !== null && remoteStream) video.srcObject = remoteStream;
        }}
      ></video>

      <div id="video-controls">
        <button onClick={toggleMic}>
          {micOn === true ? (
            <img
              src="/assets/icons/microphone-on.png"
              width={iconSize}
              height={iconSize}
            />
          ) : (
            <img
              src="/assets/icons/microphone-off.png"
              width={iconSize}
              height={iconSize}
            />
          )}
        </button>

        <button onClick={toggleWebcam}>
          {webcamOn === true ? (
            <img
              src="/assets/icons/video-camera-on.png"
              width={iconSize}
              height={iconSize}
            />
          ) : (
            <img
              src="/assets/icons/video-camera-off.png"
              width={iconSize}
              height={iconSize}
            />
          )}
        </button>

        {/* TODO: end call functionality implementation required */}
        {/* <button onClick={endCall}>
          <img src="/assets/icons/end-call-icon.png" width={iconSize} height={iconSize}/>
        </button> */}
      </div>
    </div>
  );
};

/**
 * VideoCall component envelopes the VideoCallBase component, with the auth HOC,
 * requiring the loggedIn state and also the error to be displayed
 */
const VideoCall = withAuthHOC(VideoCallBase, true, true);

export default VideoCall;
