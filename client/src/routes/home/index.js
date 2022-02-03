import {  h } from 'preact';
import style from './style.css';

import { callPeer } from '../../utils/calling.util';
import { setStream } from '../../utils/video_stream.util';
import { createPeerConnection } from '../../utils/webrtc.util';
import { useEffect, useRef, useState } from 'preact/hooks';

const Home = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    // const localStreamRef = useRef(createRef());
    // const remoteStreamRef = useRef(createRef());

    useEffect(() => {
        async function init() {
            try {
                // uncomment below code, when ipfs package starts working again
                // const cid = await addDataToIPFS(await createIPFSNode(), JSON.stringify({
                //     name: 'Gourav',
                //     friends: ['Sai', 'Vanshika', 'Hrithvik']
                // }));
                const cid = null;
                console.log(cid);
            } catch (e) {
                console.error(e);
            }
        }

        init();
    }, []);

    useEffect(() => {
        if (peerConnection !== undefined){
            localStorage.setItem('peer-connection', JSON.stringify(peerConnection));

            console.log({peerConnection, remoteStream, localStream});
        
            callPeer({
                peerConnection,
                setLocalStream,
                setRemoteStream,
            });
        }
    }, [peerConnection]);

    // useEffect(() => {
    //     if (localStream && localStreamRef !== null) {
    //         if (localStreamRef.current instanceof HTMLMediaElement) {
    //             localStreamRef.current.srcObject = localStream;
    //         }
    //     }
    // }, [localStream]);

    // useEffect(() => {
    //     if (remoteStream && remoteStreamRef !== null) {
    //         if (remoteStreamRef.current instanceof HTMLMediaElement) {
    //             remoteStreamRef.current.srcObject = remoteStream;
    //         }
    //     }
    // }, [remoteStream]);

    const initiateCall = () => {
        const tempPC = createPeerConnection();
        setPeerConnection(tempPC);

        console.info(tempPC);
    }

    // ? Check: Webrtc adapter for polyfills on browser: https://github.com/webrtcHacks/adapter

    return (
        <div class={style.home}>
            <h1>Home</h1>
            <p>This is the Home component.</p>
            <button onClick={() => initiateCall()}>Call A Peer</button>

            <br />
            <h2>Local Video</h2>
            <video id="localstream" autoPlay style={{ width: '40%' }} ref={(video) => {
                if (video !== null && localStream)
                    video.srcObject = localStream;
            }}></video>

            <h2>Remote Video</h2>
            <video id="remotestream" autoPlay style={{ width: '40%' }} ref={(video) => {
                if (video !== null && remoteStream)
                    video.srcObject = remoteStream;
            }}></video>
        </div>
    );
};

export default Home;
