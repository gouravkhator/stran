/** @jsx h */
import { h } from "preact";

import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";

import ReactPlayer from "react-player";

import {
  getAccessTokenVideoSDK,
  createMeeting,
} from "../../services/videosdk.service";

function JoinScreen({ getMeetingInfo }) {
  const [meetingId, setMeetingId] = useState(null);

  const onClick = async () => {
    await getMeetingInfo(meetingId);
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onInput={(e) => {
          setMeetingId(e.target.value);
        }}
      />

      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function VideoComponent(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn } = useParticipant(
    props.participantId,
  );

  const videoStream = useMemo(() => {
    if (webcamOn) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error),
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div key={props.participantId}>
      {micOn && micRef && <audio ref={micRef} autoPlay />}
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={true}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"100px"}
          width={"100px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button onClick={leave}>Leave</button>
      <button onClick={toggleMic}>toggleMic</button>
      <button onClick={toggleWebcam}>toggleWebcam</button>
    </div>
  );
}

function Container(props) {
  const [joined, setJoined] = useState(false);
  const { join, participants } = useMeeting();

  const joinMeeting = () => {
    setJoined(true);
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined ? (
        <div>
          <Controls />
          {[...participants.keys()].map((participantId) => (
            <VideoComponent participantId={participantId} />
          ))}
        </div>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

function VideoSDKAppBase() {
  const [meetingId, setMeetingId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const tempAuthToken = await getAccessTokenVideoSDK();
        setAuthToken(() => tempAuthToken);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const getMeetingInfo = async (id) => {
    console.log({ authToken });
    const meetingId =
      id == null ? await createMeeting({ videoSDKToken: authToken }) : id;

    setMeetingId(() => meetingId);
  };

  return authToken !== null && meetingId !== null ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: false,
        name: "C.V. Raman",
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => <Container meetingId={meetingId} />}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingInfo={getMeetingInfo} />
  );
}

// TODO: add the withAuthHOC here, once we validate that this sdk works
const VideoSDKApp = VideoSDKAppBase;

export default VideoSDKApp;
