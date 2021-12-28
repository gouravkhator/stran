import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default LoginScreen = ({ navigation }) => {
	const [userId, setUserId] = useState('');
	const [loading, setLoading] = useState(false);

	const onLogin = async () => {
		setLoading(true);
		try {
			await AsyncStorage.setItem('userId', userId);
			setLoading(false);
			navigation.navigate('MainScreen');
		} catch {
			// TODO: set error globally
			setLoading(false);
		}
	}

	return (
		<View>
			<Text>Enter your userid</Text>
			<TextInput
				label="Your User ID"
				onChangeText={(text) => setUserId(text)}
				mode="outlined"
			/>

			<Icon.Button
				name="sign-in-alt"
				backgroundColor="#3b5998"
				loading={loading}
				disabled={userId.length === 0}
				onPress={() => onLogin()}>
				Login
			</Icon.Button>

			{/* <TouchableOpacity
				style={styles.button}
				onPress={navigateToSignupPage}
				activeOpacity={opacityOfButtons}
				delayPressOut={delayOfOpacity}
			>
				<Text style={styles.buttonText}>New to Arms ?</Text>
			</TouchableOpacity> */}
		</View>
	);
};
