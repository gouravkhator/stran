export async function captureStream() {
    let isFront = true;
    const sourceInfos = await navigator.mediaDevices.enumerateDevices();

    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
            videoSourceId = sourceInfo.deviceId;
        }
    }

    const stream = await navigator.mediaDevices.getUserMedia({
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

/**
 * Sets the incoming stream to target element 
 */
export function setStream({incomingStream, targetElement}){
    if ('srcObject' in targetElement) {
        targetElement.srcObject = incomingStream;
    } else {
        // fallback for older browsers
        targetElement.src = URL.createObjectURL(incomingStream);
    }
}

