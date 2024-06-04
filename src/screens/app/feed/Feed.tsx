import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getSongs, getAlbums, Song, Album, UserProfile } from '../../../api';
import SongListItem from '../../../components/SongListItem';
import AlbumCardItem from '../../../components/AlbumCardItem';
import { usePlayer } from '../../../contexts/PlayerContext';
import { useLike } from '../../../contexts/LikeContext';
import MiniPlayer from '../../../components/MiniPlayer';
import SongsCard from '../../../components/SongsCard';
import AlbumsCard from '../../../components/AlbumsCard';

export type RootStackParamList = {
  MainFeed: undefined;
  Player: undefined;
  AddSong: undefined;
  Profile: { profile: UserProfile | null };
  FollowersOrFollowing: { profile: UserProfile; type: 'followers' | 'following' };
  Library: undefined;
};

function Feed(): React.JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tracks, currentTrack, setCurrentTrack, setTracks } = usePlayer();
  const { likedSongs } = useLike();

  const fetchSongs = async () => {
    try {
      const songs = await getSongs();
      setSongs(songs);
    } catch (error) {
      console.error('Failed to fetch songs', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const albums = await getAlbums();
      setAlbums(albums);
    } catch (error) {
      console.error('Failed to fetch albums', error);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSongs();
    await fetchAlbums();
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SongsCard songs={songs} />
        <AlbumsCard albums={albums} />
      </ScrollView>
      <MiniPlayer />
    </>
  );
}

const styles = StyleSheet.create({
  albumContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Feed;
