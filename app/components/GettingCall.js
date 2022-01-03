import React from 'react';
import { View, StyleSheet } from 'react-native';

import ButtonIcon from './ButtonIcon';

export default GettingCall = ({ navigation, ...props }) => {
	return (
		<View>
            <Text>{props.callerUsername} calling...</Text>
			<ButtonIcon iconName="phone" backgroundColor="green" onPress={props.join}/>
            <ButtonIcon iconName="phone" backgroundColor="red" onPress={props.hangupCall}/>
		</View>
	);
};

const styles = StyleSheet.create({

});
