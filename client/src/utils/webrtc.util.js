import { captureStream } from './video_stream.util';

/**
 * Creates the RTC Peer connection
 * @returns The RTC Peer connection after setting it up with STUN server
 */
export function createPeerConnection() {
    const configuration = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };
    const peerConnection = new RTCPeerConnection(configuration);

    return peerConnection;
}

/**
 * Sets up the Local and Remote Streams
 */
export async function setupPeers({
    peerConnection,
    setLocalStream,
    setRemoteStream
}) {
    // let pc = null;

    // if(peerConnection !== undefined){
    //     pc = peerConnection;
    // }else{
    //     pc = createPeerConnection();
    // }
    const pc = peerConnection ?? createPeerConnection(); 
    // ! ISSUE: nullish coalescing operator does not work, tried that stackoverflow solution too

    const stream = await captureStream();

    if (stream) {
        setLocalStream(stream);
        for (const track of stream.getTracks()) {
            pc.addTrack(track);
        }
    }

    // get the remote stream once it is available
    pc.ontrack = ({streams: [remoteStream]}) => {
        setRemoteStream(remoteStream);
    }

    return pc;
}

export async function collectIceCandidates(pc) {
    if (pc) {
        // on new ICE candidate, add it to the ipfs caller database

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                // add event.candidate to the ipfs caller database
            }
        }
    }

    // TODO: get the ICE candidate added
    // use pubsub of IPFS to get the added candidates, and uncomment below codes
    // const addedCandidate = null;

    // and update the local PC
    // const candidate = new RTCIceCandidate(addedCandidate);
    // pc.addIceCandidate(candidate);
}
