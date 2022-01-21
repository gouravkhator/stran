import { setupPeers, collectIceCandidates } from './webrtc.util.js';

/**
 * Sets the peer connection if not provided, sets local and remote streams,
 * collects ice candidates, and creates and saves offer for the call in IPFS.
 */
export async function callPeer({
    peerConnection,
    currentCall = {
        connecting: false
    },
    setLocalStream,
    setRemoteStream
}) {
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

    currentCall.connecting = true;

    // peerConnection can either be provided or will be undefined
    // either way, on provided peerConnection or newly created one, the local and remote streams will be set..  
    const pc = await setupPeers({ peerConnection, setLocalStream, setRemoteStream });

    // exchange ICE candidates between caller and callee
    collectIceCandidates(pc);

    if (pc) {
        // create the offer for the call
        const offer = await pc.createOffer();
        pc.setLocalDescription(offer);

        const offerToStore = {
            offer: {
                type: offer.type,
                sdp: offer.sdp
            }
        };

        // TODO: store offerToStore in ipfs
    }
}

export async function receiveCall(){

}
