import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';

export default ButtonIcon = ({ navigation, ...props }) => {
    return (
        <View>
            <TouchableOpacity
                onPress={props.onPress}
                style={[
                    { backgroundColor: props.backgroundColor },
                ]}
            >
                <Icon
                    icon={props.iconName}
                    onPress={() => props.onPress()}
                />
                {props.text !== '' && <Text>{props.text}</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({

});
