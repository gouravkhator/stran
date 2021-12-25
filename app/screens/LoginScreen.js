import React, { } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default LoginScreen = ({ navigation }) => {
	const styles = globalStyles;
	const opacityOfButtons = 0.45, delayOfOpacity = 0.001;

	const navigateToSignupPage = () => {
		navigation.navigate('SignupScreen');
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Arms</Text>
			<TouchableOpacity
				style={styles.button}
				onPress={navigateToSignupPage}
				activeOpacity={opacityOfButtons}
				delayPressOut={delayOfOpacity}
			>
				<Text style={styles.buttonText}>New to Arms ?</Text>
			</TouchableOpacity>
		</View>
	);
};
