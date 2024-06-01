import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayer } from '../../contexts/PlayerContext';

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
    } = usePlayer();

    if (!currentTrack) {
        return <Text>Loading...</Text>;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying) {
                setCurrentDuration(currentDuration + 1); // Увеличиваем текущую длительность на 1 секунду каждую секунду
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, currentDuration, setCurrentDuration]);

    return (
        <View style={styles.container}>
            <Image source={{ uri: `http://10.0.2.2:8000/file/image/${currentTrack.cover_file}` }} style={styles.coverImage} />
            <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{currentTrack.name}</Text>
                <Text style={styles.trackArtist}>{currentTrack.user_id}</Text>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={totalDuration || 1}
                value={currentDuration}
                onValueChange={(value) => setCurrentDuration(value)}
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
    coverImage: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    playerControls: {
        alignItems: 'center',
        marginBottom: 40,
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
        color: 'gray',
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
