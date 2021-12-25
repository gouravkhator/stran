import React, { } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/*
import LoginChooser from "./components/LoginChooser";
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
*/

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
			</Stack.Navigator>
		</NavigationContainer>
	);
};

