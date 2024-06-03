import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayer } from '../contexts/PlayerContext';
import { Text } from '@rneui/themed';
import { UserProfile, getUserProfile } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

const MiniPlayer: React.FC = () => {
    const {
        currentTrack,
        isPlaying,
        playPause,
        isLoading,
    } = usePlayer();

    const navigation = useNavigation<NavigationProp<any>>();

    if (!currentTrack) {
        return null;
    }

    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await getUserProfile(currentTrack.user_id);
                setProfile(userProfile);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };

        fetchProfile();
    }, [currentTrack.user_id]);

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Player')}>
            <Image source={{ uri: `http://10.0.2.2:8000/file/image/${currentTrack.cover_file}` }} style={styles.coverImage} />
            <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{currentTrack.name}</Text>
                <Text style={styles.trackArtist}>{profile?.display_name}</Text>
            </View>
            <TouchableOpacity onPress={playPause} style={styles.playPauseButton}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#333',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
    },
    coverImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
    },
    trackInfo: {
        flex: 1,
        marginLeft: 10,
    },
    trackTitle: {
        color: '#fff',
        fontSize: 14,
    },
    trackArtist: {
        color: '#ccc',
        fontSize: 12,
    },
    playPauseButton: {
        padding: 10,
    },
});

export default MiniPlayer;