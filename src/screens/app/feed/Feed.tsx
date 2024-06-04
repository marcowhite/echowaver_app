import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getSongs, getAlbums, getUserFollowsById, Song, Album, UserProfile, User } from '../../../api';
import { usePlayer } from '../../../contexts/PlayerContext';
import { useLike } from '../../../contexts/LikeContext';
import MiniPlayer from '../../../components/MiniPlayer';
import SongsCard from '../../../components/SongsCard';
import AlbumsCard from '../../../components/AlbumsCard';
import FollowsCard from '../../../components/FollowsCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../../contexts/UserContext';
import { track } from '@amplitude/analytics-react-native';

export type RootStackParamList = {
  MainFeed: undefined;
  Player: undefined;
  Profile: { profile: UserProfile | null };
  FollowersOrFollowing: { profile: UserProfile; type: 'followers' | 'following' };
  Library: undefined;
};



function Feed(): React.JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [follows, setFollows] = useState<UserProfile[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tracks, currentTrack, setCurrentTrack, setTracks } = usePlayer();
  const { likedSongs } = useLike();
  const { currentUser } = useUser();

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

  const fetchFollows = async () => {
    if (!currentUser) return;
    try {
      const follows = await getUserFollowsById(currentUser.id);
      setFollows(follows);
    } catch (error) {
      console.error('Failed to fetch follows', error);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
    track("Opened Feed")
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchFollows();
    }
  }, [currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSongs();
    await fetchAlbums();
    if (currentUser) {
      await fetchFollows();
    }
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollViewContent}
      >
        {currentUser && (
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile', { profile: currentUser })}
            >
              <Image
                source={currentUser.avatar ? { uri: `http://10.0.2.2:8000/file/image/${currentUser.avatar}` } : require("../../../components/default_user.jpg")}
                style={styles.avatar}
              />
              <Text style={styles.profileButtonText}>{currentUser.display_name}</Text>
            </TouchableOpacity>
          </View>
        )}
        <SongsCard songs={songs} />
        {/* <AlbumsCard albums={albums} /> */}
        {follows.length > 0 && (<FollowsCard follows={follows} navigation={navigation} />)}
      </ScrollView>
      <MiniPlayer />
    </>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    width: '100%',
    height: 70,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileButtonText: {
    fontSize: 18,
    color: '#000',
  },
  scrollViewContent: {
    paddingBottom: 100, // чтобы контент не перекрывался футером
  },
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
