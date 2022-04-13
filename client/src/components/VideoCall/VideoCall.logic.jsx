import Peer from "peerjs";
import { useEffect, useState } from "preact/hooks";
import { callPeer, answerCall } from "../../services/peerjs.service";

export default function VideoCallLogic() {
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
    /**
     * ! ISSUE: Public Peer server gets down sometimes..
     * This peer connection connects to a public peer server, but sometimes that peer server is down..
     * If we need to have the peer server running always, we need to host our own.
     */
    const peer = new Peer(peerjsConfguration);

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

    answerCall({ peer: peerConn, setLocalStream, setRemoteStream });
  }, [peerConn]);

  const initiateCall = async () => {
    await callPeer({ peer: peerConn, destId, setLocalStream, setRemoteStream });
  };

  const handleDestIdInput = (event) => {
    setDestId((oldDestId) => event.target.value);
  };

  return {
    peerConn,
    initiateCall,
    localStream,
    remoteStream,
    handleDestIdInput,
  };
}
