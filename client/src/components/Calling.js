import { h } from "preact";
import Peer from "peerjs";
import { useEffect, useState } from "preact/hooks";
import { callPeer, answerCall } from "../services/peerjs.service";

const Calling = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConn, setPeerConn] = useState(null);

  const [destId, setDestId] = useState("");

  const peerjsConfguration = {
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // {urls: 'turn:user@turn.bistri.com:80', credential: 'usercredential'}
      ],
    },
  };

  useEffect(() => {
    const peer = new Peer(peerjsConfguration);

    peer.on("open", (id) => {
      console.log("Congrats! You are a peer in this video-calling dapp");
      console.info("Your id is: " + id);
      setPeerConn(peer);
    });
  }, []);

  useEffect(() => {
    if (!peerConn) {
      return;
    }

    answerCall({ peer: peerConn, setLocalStream, setRemoteStream });
  }, [peerConn]);

  const initiateCall = async () => {
    await callPeer({ peer: peerConn, destId, setLocalStream, setRemoteStream });
  };

  const handleDestIdInput = (event) => {
    setDestId(event.target.value);
  };

  return (
    <div>
      <h2>Calling Component</h2>

      {peerConn?._id && <h3>Your id: {peerConn._id}</h3>}

      <button onClick={() => initiateCall()}>Call</button>

      <input onChange={(event) => handleDestIdInput(event)} />
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
};

export default Calling;
