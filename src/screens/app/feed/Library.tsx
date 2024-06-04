import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { UserProfile, getUserLikes, Song, getSongById } from '../../../api';
import { usePlayer } from '../../../contexts/PlayerContext';
import MiniPlayer from '../../../components/MiniPlayer';
import SongsCard from '../../../components/SongsCard';
import { RootStackParamList } from './Feed';
import { useUser } from '../../../contexts/UserContext';

function Library(): React.JSX.Element {
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { setCurrentTrack, setTracks } = usePlayer();
    const { currentUser } = useUser();

    const fetchLikedSongs = async () => {
        if (!currentUser) return;
        try {
            const userLikes = await getUserLikes(currentUser.id);
            const likedSongPromises = userLikes.song_like.map(async (like: { liked_id: number; }) => {
                const song = await getSongById(like.liked_id);
                return song;
            });
            const likedSongs = await Promise.all(likedSongPromises);
            setLikedSongs(likedSongs);
        } catch (error) {
            console.error('Failed to fetch liked songs', error);
        }
    };

    useEffect(() => {
        fetchLikedSongs();
    }, [currentUser]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLikedSongs();
        setRefreshing(false);
    };

    return (
        <>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <SongsCard songs={likedSongs} />
            </ScrollView>
            <MiniPlayer />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Library;
