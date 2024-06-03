import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayer } from '../../../contexts/PlayerContext';
import { UserProfile, getUserProfile } from '../../../api';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './Feed';

const Player: React.FC = () => {
    const {
        currentTrack,
        isPlaying,
        currentDuration,
        totalDuration,
        volume,
        playPause,
        stop,
        setVolume,
        nextTrack,
        prevTrack,
        setCurrentDuration,
        isLoading,
    } = usePlayer();

    if (!currentTrack) {
        return <Text>Loading...</Text>;
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

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            <View style={styles.coverImageContainer}>
                <Image source={{ uri: `http://10.0.2.2:8000/file/image/${currentTrack.cover_file}` }} style={styles.coverImage} />
                {isLoading && <View style={styles.overlay}>
                    <ActivityIndicator style={styles.loadingIndicator} size="large" color="#ffffff" />
                </View>}
            </View>
            <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{currentTrack.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Profile', { profile })}>
                    <Text style={styles.trackArtist}>{profile?.display_name}</Text>
                </TouchableOpacity>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={totalDuration || 1}
                value={currentDuration}
                onValueChange={(value) => setCurrentDuration(value)}
                onSlidingComplete={(value) => setCurrentDuration(value)}
                disabled={!currentTrack}
            />
            <View style={styles.duration}>
                <Text style={styles.durationText}>
                    {formatTime(currentDuration)} / {formatTime(totalDuration)}
                </Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={prevTrack} disabled={!currentTrack}>
                    <Ionicons name={'play-back'} size={32} style={styles.controlButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={playPause} disabled={!currentTrack}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} style={styles.controlButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={stop} disabled={!currentTrack}>
                    <Ionicons name={'stop'} size={32} style={styles.controlButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={nextTrack} disabled={!currentTrack}>
                    <Ionicons name={'play-forward'} size={32} style={styles.controlButton} />
                </TouchableOpacity>
            </View>
            <View style={styles.volumeControl}>
                <Ionicons name={'volume-off'} size={32} style={styles.volumeLabel} />
                <Slider
                    style={styles.volumeSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={setVolume}
                />
                <Ionicons name={'volume-high'} size={32} style={styles.volumeLabel} />
            </View>
        </View>
    );
};

// Helper function to format time in minutes and seconds
const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    coverImageContainer: {
        position: 'relative',
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    loadingIndicator: {
        width: '100%',
        height: '100%',
    },
    trackInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    trackTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    trackArtist: {
        fontSize: 14,
        textAlign: 'center',
        color: 'blue',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginBottom: 15,
    },
    controlButton: {
        color: 'gray',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    duration: {
        marginBottom: 10,
        alignItems: 'center',
    },
    durationText: {
        fontSize: 14,
        color: 'gray',
    },
    volumeControl: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    volumeLabel: {
        marginRight: 10,
    },
    volumeSlider: {
        flex: 1,
    },
});

export default Player;
