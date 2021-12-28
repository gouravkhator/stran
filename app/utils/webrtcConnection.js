import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
} from 'react-native-webrtc';

/**
 * Sets up the RTC Peer connection
 * @returns The RTC Peer connection after setting it up with STUn server
 */
function configureWebrtc() {
    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    const peerConnection = new RTCPeerConnection(configuration);

    return peerConnection;
}

function captureSenderStream() {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
        console.log(sourceInfos);
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                videoSourceId = sourceInfo.deviceId;
            }
        }

        mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: 640,
                height: 480,
                frameRate: 30,
                facingMode: (isFront ? "user" : "environment"),
                deviceId: videoSourceId
            }
        }).then(stream => {
            // got the stream
        }).catch(error => {
            // got an error
        });
    });
}

function callOtherPeer(peerConnection) {
    peerConnection.createOffer().then(desc => {
        pc.setLocalDescription(desc).then(() => {
            // Send pc.localDescription to peer
        });
    });

    peerConnection.onicecandidate = function (event) {
        // send event.candidate to peer
    };
}
