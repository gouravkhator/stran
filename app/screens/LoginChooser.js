import React, { } from 'react';
import globalStyles from '../styles/globalStyles';
import { View, Text, TouchableOpacity } from 'react-native';

export default LoginChooser = ({ navigation }) => {
    const styles = globalStyles;
    const opacityOfButtons = 0.45, delayOfOpacity = 0.001;

    const navigateToLoginPage = () => {
        navigation.navigate('LoginScreen');
    }

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
                <Text style={styles.buttonText}>Create a new ID {'>'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={navigateToLoginPage}
                activeOpacity={opacityOfButtons}
                delayPressOut={delayOfOpacity}
            >
                <Text style={styles.buttonText}>Have an existing ID ?</Text>
            </TouchableOpacity>
        </View>
    );
};
