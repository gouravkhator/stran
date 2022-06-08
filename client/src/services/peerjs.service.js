import { captureStream } from "../utils/video_stream.util";

export function answerCall({ peer, setIncomingCall, setLocalStream, setRemoteStream }) {
  if (!peer) {
    return;
  }

  peer.on("call", async function (call) {
    const localStream = await captureStream();
    setLocalStream(() => localStream);

    // Answer the call, providing our mediaStream
    call.answer(localStream);

    call.on("stream", function (remoteStream) {
      setRemoteStream((previousRemoteStream) => remoteStream);
    });
  });
}

export async function callPeer({
  peer,
  destId,
  setLocalStream,
  setRemoteStream,
}) {
  if (!peer) {
    return;
  }

  const localStream = await captureStream();
  setLocalStream((previousLocalStream) => localStream);

  const call = peer.call(destId, localStream);

  call.on("stream", function (remoteStream) {
    setRemoteStream((previousRemoteStream) => remoteStream);
  });
}
