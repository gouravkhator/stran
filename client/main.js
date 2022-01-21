import { createPeerConnection } from './utils/webrtc.util.js';
import { callPeer } from './utils/calling.util.js';
import { setStream } from './utils/video_stream.util.js';

const callBtn = document.querySelector("#call-btn");

callBtn.addEventListener('click', initiateCall);

// save peerConnection and ipfs node in the local storage or indexeddb and use them in future
const peerConnection = createPeerConnection();

// the below setLocalStream and setRemoteStream will be set after peer connection in the call initiation
function setLocalStream(stream) {
    const localStream = document.querySelector('#local-stream');
    setStream({ incomingStream: stream, targetElement: localStream });
}

function setRemoteStream(stream) {
    const remoteStream = document.querySelector('#remote-stream');
    setStream({ incomingStream: stream, targetElement: remoteStream });
}

function initiateCall() {
    callPeer({
        peerConnection,
        setLocalStream,
        setRemoteStream,
    });
}

// TODO: Webrtc adapter for polyfills on browser: https://github.com/webrtcHacks/adapter
