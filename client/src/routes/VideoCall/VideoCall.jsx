/** @jsx h */
import { h } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";
import { useSelector } from "react-redux";
import { withAuthHOC } from "../../hoc/auth.hoc";

import ErrorNSuccess from "../../components/ErrorNSuccess";

import VideoCallLogic from "./VideoCall.logic";

/**
 * VideoCallBase is the VideoCall component without the auth HOC wrapper.
 */
const VideoCallBase = () => {
  /**
   * this VideoCallLogic creates the peer connection if not already created,
   * and also monitors the incoming call and sets the incomingCall in the redux store
   */
  const {
    initiateCallToDest,
    handleDestIdInput,
    toggleMic,
    toggleWebcam,
    answerCallWrapper,
    endCall,
  } = VideoCallLogic();

  const peerConn = useSelector(({ call }) => call.peerConn);
  const isCallee = useSelector(({ call }) => call.isCallee);
  const currCall = useSelector(({ call }) => call.currCall);
  const inCall = useSelector(({ call }) => call.inCall);
  const localStream = useSelector(({ call }) => call.localStream);

  const micOn = useSelector(({ call }) => call.micOn);
  const webcamOn = useSelector(({ call }) => call.webcamOn);

  const iconSize = "30";

  /*------------------Side Effects------------------*/
  useEffect(() => {
    if (inCall === true) {
      // push the path of the call page to this page, so that we can go back to this page again..
      route(`/call/${currCall?.connectionId || ""}`);
    }
  }, [inCall]);

  /*------------------Default Renders------------------*/
  return (
    <div>
      <ErrorNSuccess />
      <div>
        <h2>Feeling Lonely?? Feeling Bored??</h2>
        <h3>Wanna Call some Strans??</h3>
        <h3>Go check them out with a single click right below..</h3>
      </div>
      {currCall !== null && isCallee === true && (
        <div id="incoming-call">
          <p>
            You are receiving a call from some stran, please answer or end the
            call
          </p>

          <button
            onClick={() => answerCallWrapper(currCall)}
            class="answer-call"
          >
            <img
              src="/assets/icons/calling/phone-ringing.png"
              width={iconSize}
              height={iconSize}
            />
          </button>

          <button onClick={endCall} class="end-call">
            <img
              src="/assets/icons/calling/end-call.png"
              width={iconSize}
              height={iconSize}
            />
          </button>
        </div>
      )}
      {peerConn?._id && <h3>Your id: {peerConn._id}</h3>}
      {/*-----------Call Provided Peer or Random Peer-----------*/}
      <button
        onClick={() => initiateCallToDest({ isCalleeRandom: true })}
        disabled={currCall === null ? false : true}
      >
        <strong style={{ fontSize: "20px" }}>
          Call Random Available Stran
        </strong>{" "}
        <span>
          <img
            src="/assets/icons/calling/end-call.png"
            width={iconSize}
            height={iconSize}
          />
        </span>
      </button>

      <br />
      <p>Or enter the user's ID below to call:</p>

      <button
        onClick={() => initiateCallToDest({ isCalleeRandom: false })}
        disabled={currCall === null ? false : true}
      >
        Call
      </button>
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
      {/*-----------Video Controls-----------*/}
      <div id="video-controls">
        <button onClick={toggleMic}>
          {micOn === true ? (
            <img
              src="/assets/icons/calling/microphone-on.png"
              width={iconSize}
              height={iconSize}
            />
          ) : (
            <img
              src="/assets/icons/calling/microphone-off.png"
              width={iconSize}
              height={iconSize}
            />
          )}
        </button>

        <button onClick={toggleWebcam}>
          {webcamOn === true ? (
            <img
              src="/assets/icons/calling/webcam-on.png"
              width={iconSize}
              height={iconSize}
            />
          ) : (
            <img
              src="/assets/icons/calling/webcam-off.png"
              width={iconSize}
              height={iconSize}
            />
          )}
        </button>
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
