import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';

import Icon from 'react-native-vector-icons/FontAwesome';
import FriendsList from '../components/FriendsList';

/**
 * MainScreen will contain a list of friends and the call button.
 * It will also contain user id and account management, along with status chooser and settings option.
 * It may contain dark mode too.
 */
export default MainScreen = ({ navigation }) => {
    const startCallWithUnknown = ()=>{

    }

	return (
		<View>
            <FriendsList />
			<Icon.Button
				icon="video-camera"
				backgroundColor="#3b5998"
				onPress={() => startCallWithUnknown()}>
				Call a New Face
			</Icon.Button>
		</View>
	);
};
