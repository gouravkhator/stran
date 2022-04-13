/** @jsx h */
import { h } from "preact";
import VideoCallLogic from "./VideoCall.logic";

export default function VideoCall() {
  const {
    peerConn,
    initiateCall,
    localStream,
    remoteStream,
    handleDestIdInput,
  } = VideoCallLogic();

  return (
    <div>
      <h2>Calling Component</h2>

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
          if (video !== null && remoteStream) video.srcObject = remoteStream;
        }}
      ></video>
    </div>
  );
}
