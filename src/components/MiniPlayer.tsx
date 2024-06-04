import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayer } from '../contexts/PlayerContext';
import { useLike } from '../contexts/LikeContext';
import { Text } from '@rneui/themed';
import { UserProfile, getUserProfile } from '../api';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const MiniPlayer: React.FC = () => {
    const { currentTrack, isPlaying, playPause } = usePlayer();
    const { isLiked, toggleLike } = useLike();
    const navigation = useNavigation<NavigationProp<any>>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentTrack) {
                try {
                    const userProfile = await getUserProfile(currentTrack.user_id);
                    setProfile(userProfile);
                } catch (error) {
                    console.error('Failed to fetch profile', error);
                }
            }
        };

        fetchProfile();
    }, [currentTrack]);

    const handleToggleLike = async () => {
        setIsLoading(true);
        await toggleLike(currentTrack?.id ?? 0);
        setIsLoading(false);
    };

    if (!currentTrack) {
        return null;
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={() => navigation.navigate('Player')}
        >
            <Image
                source={{ uri: `http://10.0.2.2:8000/file/image/${currentTrack.cover_file}` }}
                style={styles.coverImage}
            />
            <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{currentTrack.name}</Text>
                <Text style={styles.trackArtist}>{profile?.display_name}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity activeOpacity={1} onPress={handleToggleLike} style={styles.likeButton} disabled={isLoading}>
                    <Ionicons name={isLiked(currentTrack.id) ? 'heart' : 'heart-outline'} size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={playPause} style={styles.playPauseButton}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>
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
        height: 70,
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
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButton: {
        padding: 10,
    },
    playPauseButton: {
        padding: 10,
    },
});

export default MiniPlayer;
