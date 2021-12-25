import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import globalStyles from '../styles/globalStyles';

export default SignupScreen = ({ navigation }) => {
	const styles = globalStyles;
	const opacityOfButtons = 0.45, delayOfOpacity = 0.001;
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const navigateToLoginPage = () => {
		navigation.navigate('LoginScreen');
	}

	const saveLoginDetails = () => {
		if (username === '' || password === '') {
			// TODO: set error message in this page
			setError('');
			return;
		}

		// TODO: store the hashedPW and username somewhere decentralised
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Arms</Text>

			{/* TODO: show error message here (if any)*/}

			<TextInput
				style={styles.textInput}
				onChangeText={(text) => setUserName(text)}
				value={username}
				placeholder="Enter your pseudo name"
				returnKeyType={'next'}
			/>

			<TextInput
				style={styles.textInput}
				onChangeText={(userPassword) => setPassword(userPassword)}
				placeholder="Enter your password"
				secureTextEntry={true}
				returnKeyType={'done'}
			/>

			<TouchableOpacity
				style={styles.button}
				onPress={saveLoginDetails}
				activeOpacity={opacityOfButtons}
				delayPressOut={delayOfOpacity}
			>
				<Text style={styles.buttonText}>Create an Arms Account</Text>
			</TouchableOpacity>

			<View>
				<Text>
					Note: Forgetting credentials will lead to non-retrievable account
				</Text>
			</View>

			<TouchableOpacity
				style={styles.button}
				onPress={navigateToLoginPage}
				activeOpacity={opacityOfButtons}
				delayPressOut={delayOfOpacity}
			>
				<Text style={styles.buttonText}>Already an Arms user ?</Text>
			</TouchableOpacity>
		</View>
	);
};
