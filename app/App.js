import React, { } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';

const Stack = createNativeStackNavigator();

export default App = () => {
	return (
		// Login Section commented for easy development for the main functionality
		/*
		<NavigationContainer>
		  <Stack.Navigator>
			<Stack.Screen name="LoginChooser" component={LoginChooser} options={{headerShown: false}}/>
			<Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
			<Stack.Screen name="SignupScreen" component={SignupScreen} options={{headerShown: false}}/>
		  </Stack.Navigator>
		</NavigationContainer>
		*/

		// Main Functionality
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

