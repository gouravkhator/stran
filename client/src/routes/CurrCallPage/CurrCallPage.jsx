/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { withAuthHOC } from "../../hoc/auth.hoc";
import { Link } from "preact-router";

import VideoCallLogic from "../VideoCall/VideoCall.logic";
import { useDispatch, useSelector } from "react-redux";
import { setCurrCall } from "../../store/actions/call.actions";

/**
 * CurrCallPageBase is the In-Call Page component, without the auth HOC wrapper.
 *
 * callId was passed in the url query params.
 * Other props things were passed from the parent components to it.
 */
const CurrCallPageBase = ({ callId }) => {
  // ?NOTE: checking of, whether inCall is false or not, is not done,
  // as when inCall is false, we will be for sure in the VideoCall component page

  const { toggleMic, toggleWebcam, endCall } = VideoCallLogic();

  const dispatch = useDispatch();
  const iconSize = "30";

  const [isUserActionLegit, setIsUserActionLegit] = useState(true);

  const currCall = useSelector(({ call }) => call.currCall);
  const localStream = useSelector(({ call }) => call.localStream);
  const remoteStream = useSelector(({ call }) => call.remoteStream);

  const micOn = useSelector(({ call }) => call.micOn);
  const webcamOn = useSelector(({ call }) => call.webcamOn);

  const error = useSelector(({ global }) => global.error);
  const message = useSelector(({ global }) => global.message);

  /*------------------Side Effects------------------*/
  useEffect(() => {
    if (callId !== currCall?.connectionId) {
      /**
       * the passed callId in param in the url is not the same as the one we accepted the call for,
       * this means that user has visited this call page by himself, and this is not allowed//
       */
      dispatch(setCurrCall(null)); // reset the current call id..
      setIsUserActionLegit(() => false); // this action should not be permitted.
    }
  }, []);

  useEffect(() => {
    // on unmount of the component, just end the call
    return () => {
      // !ISSUE: endCall's peer connection not set and so it causes issues, uncomment below method call
      // endCall(); // this also sets the inCall state to false
    };
  }, []);

  /*------------------Conditional Renders based on some state/value------------------*/
  /**
   * If user action is not legit, meaning the user has tried visiting random call page..
   */
  if (isUserActionLegit !== true) {
    return (
      <div>
        <p>
          You cannot visit any call with random/invalid call id, or for you were
          not invited to..
        </p>

        <Link href="/call">Get me to the Main Call Page</Link>
      </div>
    );
  }

  /*------------------Default Renders------------------*/
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "blue" }}>{message}</p>}

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

        <button onClick={endCall}>
          <img
            src="/assets/icons/calling/end-call.png"
            width={iconSize}
            height={iconSize}
          />
        </button>
      </div>
    </div>
  );
};

/**
 * CurrCallPage component envelopes the CurrCallPageBase component, with the auth HOC,
 * requiring the loggedIn state and also the error to be displayed
 */
const CurrCallPage = withAuthHOC(CurrCallPageBase, true, true);

export default CurrCallPage;
