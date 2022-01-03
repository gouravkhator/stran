import React from 'react';
import { View } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import ButtonIcon from '../components/ButtonIcon';

export default VideoCall = ({ navigation, ...props }) => {
	// when we are calling, we just show the sender's video
	// once call is connected, we will show both the sender's and receiver's video
	return (
		<View>
			{props.localStream && (
				<>
					<RTCView streamURL={props.localStream.toURL()} objectFit={'cover'} />

					{props.remoteStream &&
						<RTCView streamURL={props.remoteStream.toURL()} objectFit={'cover'} />}
				</>
			)}
			
			<ButtonIcon iconName="phone" backgroundColor="red" onPress={props.hangupCall} />
		</View>
	);
};
