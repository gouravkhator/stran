import React, { useRef, useState } from 'react';

/* React Native components and packages */
import { View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RTCPeerConnection } from 'react-native-webrtc';

/* My components and screens */
import FriendsList from '../components/FriendsList';
import ButtonIcon from '../components/ButtonIcon';
import GettingCall from '../components/GettingCall';
import VideoCall from './VideoCall';

/* My utils */
import { callSomeoneUtil } from '../utils/webrtcConnection';

/**
 * MainScreen will contain a list of friends and the call button.
 * It will also contain user id and account management, along with status chooser and settings option.
 * It may contain dark mode too.
 */
export default MainScreen = ({ navigation }) => {
	const [localStream, setLocalStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState(null);
	const [gettingCall, setGettingCall] = useState(null);

	// useRef is used for below variables so that they will persist during the whole lifetime of component
	// not just during the render of the component
	const pc = useRef();
	const connecting = useRef(false); // for checking if the call is connected or not

	const callSomeone = async () => {
		await callSomeoneUtil({
			pcRef: pc,
			connectingRef: connecting,
			setLocalStream,
			setRemoteStream
		});
	}

	const joinCall = async () => { }
	const hangupCall = async () => { }

	if (gettingCall) {
		return (
			<GettingCall
				hangupCall={hangupCall}
				joinCall={joinCall}
			/>
		)
	}

	if (localStream) {
		return (
			<VideoCall
				hangupCall={hangupCall}
				localStream={localStream}
				remoteStream={remoteStream}
			/>
		)
	}

	return (
		<View>
			<FriendsList />
			<ButtonIcon iconName="video" backgroundColor="#3b5998" onPress={() => callSomeone()} />
		</View>
	);
};
