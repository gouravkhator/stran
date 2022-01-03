import { RTCPeerConnection, mediaDevices } from 'react-native-webrtc';

export const captureStream = async () => {
    let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();

    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
            videoSourceId = sourceInfo.deviceId;
        }
    }

    const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: (isFront ? "user" : "environment"),
            deviceId: videoSourceId
        }
    });

    return stream;
}

export const setupWebrtc = async (
    {
        pcRef,
        setLocalStream,
        setRemoteStream
    }) => {
    pcRef.current = createPeerConn();

    const stream = await captureStream();
    if (stream) {
        setLocalStream(stream);
        pcRef.current.addStream(stream);
    }

    // get the remote stream once it is available
    pcRef.current.onaddstream = (event) => {
        setRemoteStream(event.stream);
    }
}

export const callSomeoneUtil = async ({
    pcRef,
    connectingRef,
    setLocalStream,
    setRemoteStream
}) => {
    /*
    The video https://youtu.be/pv3UHYwgxnM showed that he is storing all things in firebase.
    The main thing is there is a collection called meet which has a document called chatid.
    In that document, we have a caller collection and a callee collection.
    While adding event.candidate, it adds it to the caller collection.
    To get ICE candidates added, it checks from callee collection. And if that has been added, then it will get the addedCandidate from there.

    The offerToStore is added in chatid document globally.

    We can use IPFS for storing caller and offer. 
    For the callee, we can have a pubsub feature of ipfs which will allow to listen for any added ICE candidates.
    Store the IPFS hashes of each in the smart contract.
    We can store a list of callers in ipfs and when we update that list, the hash will change and we can update that hash in smart contract.
    */

    connectingRef.current = true;

    await setupWebrtc({ pcRef, setLocalStream, setRemoteStream });

    // exchange ICE candidates between caller and callee
    collectIceCandidates(pcRef);

    if (pcRef.current) {
        // create the offer for the call

        const offer = await pcRef.current.createOffer();
        pcRef.current.setLocalDescription(offer);

        const offerToStore = {
            offer: {
                type: offer.type,
                sdp: offer.sdp
            }
        };

        // store offerToStore in ipfs
    }
}

export const collectIceCandidates = async (pcRef) => {
    if (pcRef.current) {
        // on new ICE candidate, add it to the ipfs caller database

        pcRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                // add event.candidate to the ipfs caller database
            }
        }
    }

    // TODO: get the ICE candidate added
    // use pubsub of IPFS to get the added candidates
    const addedCandidate = null;

    // and update the local PC
    const candidate = new RTCIceCandidate(addedCandidate);
    pcRef.current?.addIceCandidate(candidate);
}

/**
 * Sets up the RTC Peer connection
 * @returns The RTC Peer connection after setting it up with STUN server
 */
export function createPeerConn() {
    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    const peerConnection = new RTCPeerConnection(configuration);

    return peerConnection;
}

export async function callPeer() {
    let error = null;

    try {
        // Capture local media
        const stream = await captureStream();
        // create RTCPeerConnection and add track 
        // Note: addTrack is not implemented in react-native-webrtc so we use addStream method for now.

        const pc = createPeerConn();
        pc.addStream(stream);

        pc.onnegotiationneeded = async () => {
            // Create offer and set it as local description
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // TODO: send the offer through signalling server to the recipient
        }

        // generate ice candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendCandidateToRemotePeer(event.candidate)
            } else {
                /* there are no more candidates coming during this negotiation */
            }
        }

        // more things to do
    } catch (err) {
        throw err;
    }
}
