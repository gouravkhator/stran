/** @jsx h */
import { h } from "preact";
import { useSelector } from "react-redux";

import Redirect from "../Redirect";
import VideoCallLogic from "./VideoCall.logic";

export default function VideoCall() {
  const isLoggedIn = useSelector(({ user }) => user.loggedIn);
  
  const {
    peerConn,
    initiateCall,
    localStream,
    remoteStream,
    handleDestIdInput,
  } = VideoCallLogic();

  return (
    <>
      {!isLoggedIn ? (
        <Redirect to="/signin" />
      ) : (
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
              if (video !== null && remoteStream)
                video.srcObject = remoteStream;
            }}
          ></video>
        </div>
      )}
    </>
  );
}
