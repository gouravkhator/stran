/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { withAuthHOC } from "../../hoc/auth.hoc";
import { route } from "preact-router";

import Redirect from "../../components/Redirect";

import VideoCallLogic from "../VideoCall/VideoCall.logic";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../store/actions";
import { setCurrCall } from "../../store/actions/call.actions";

/**
 * CurrCallPageBase is the In-Call Page component, without the auth HOC wrapper.
 *
 * callId was passed in the url query params.
 * Other props things were passed from the parent components to it.
 */
const CurrCallPageBase = ({ callId }) => {
  const { toggleMic, toggleWebcam, endCall } = VideoCallLogic();

  const [isUserActionLegit, setIsUserActionLegit] = useState(true);

  const dispatch = useDispatch();

  const inCall = useSelector(({ call }) => call.inCall);
  const localStream = useSelector(({ call }) => call.localStream);
  const remoteStream = useSelector(({ call }) => call.remoteStream);

  const micOn = useSelector(({ call }) => call.micOn);
  const webcamOn = useSelector(({ call }) => call.webcamOn);

  const currCall = useSelector(({ call }) => call.currCall);

  // TODO: uncomment the below and do this legit action checks
  /*
  useEffect(() => {
    console.log({passedCallId: callId, currCallId: currCall?.connectionId});
    if (callId !== currCall?.connectionId) {
      // the passed callId in param in the url is not the same as the one we accepted the call for,
      // this means that user has visited this call page by himself, and this is not allowed//
      dispatch(setCurrCall(null)); // reset the current call id..

      console.log("illegal action");
      setIsUserActionLegit(() => false); // this action should not be permitted.

      dispatch(
        setError(
          "You cannot visit any random call, for which you were not invited to..",
        ),
      );
    }
  }, []);*/

  const iconSize = "30";

  useEffect(() => {
    // normally redux stores don't re-render the components, so we have this useEffect,
    // and it will re-render when the inCall state changes
    if (inCall === false) {
      route("/call", true); // replace path with the new url, instead of pushing to the history..
    }
  }, [inCall]);

  useEffect(() => {
    // on unmount of the component, just end the call
    return () => {
      endCall(); // this also sets the inCall state to false
    };
  }, []);

  return isUserActionLegit !== true || inCall === false ? (
    // if user action is not legit, meaning the user has tried visiting random call page
    // or the user is not in call even, but he was dropped to this page mistakenly..
    <Redirect to="/call" />
  ) : (
    <div>
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

        <button onClick={endCall}>
          <img
            src="/assets/icons/end-call-icon.png"
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
