import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { UserProfile } from '../api';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../screens/app/feed/Feed';
// import DefaultUserImage from '@assets/images/default_user.jpg';

interface FollowCardItemProps {
    follow: UserProfile;
    navigation: NavigationProp<RootStackParamList>;
}

const FollowCardItem: React.FC<FollowCardItemProps> = ({ follow, navigation }) => {
    const DefaultUserImage = require("./default_user.jpg")
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Profile', { profile: follow })}
        >
            <Image
                source={follow.avatar === "null" ? { uri: `http://10.0.2.2:8000/file/image/${follow.avatar}` } : DefaultUserImage}
                style={styles.avatar}
            />
            <View style={styles.textContainer}>
                <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">{follow.display_name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        width: '48%', // To have two items per row
        margin: '1%',
    },
    avatar: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        borderRadius: 3,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default FollowCardItem;
