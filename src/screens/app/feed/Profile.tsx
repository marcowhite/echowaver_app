import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '@rneui/themed';
import { Card } from '@rneui/themed';

import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import ProfileHeader from '../../../components/ProfileHeader';
import { Album, Song, User, getAlbumsByUserId, getSongsByUserId, getUserFollowersById, getUserFollowsById, followUserById, unfollowUserById } from '../../../api';
import { RootStackParamList } from './Feed';
import SongListItem from '../../../components/SongListItem';
import { usePlayer } from '../../../contexts/PlayerContext';
import AlbumCardItem from '../../../components/AlbumCardItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

function Profile(): React.JSX.Element {
  const route = useRoute<ProfileScreenRouteProp>();
  const { profile } = route.params;
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [follows, setFollows] = useState<User[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { tracks, currentTrack, setCurrentTrack, setTracks } = usePlayer();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!profile) {
      return;
    }

    const fetchSongs = async () => {
      try {
        const songs = await getSongsByUserId(profile.id);
        setSongs(songs);
      } catch (error) {
        console.error('Failed to fetch songs', error);
      }
    };

    const fetchAlbums = async () => {
      try {
        const albums = await getAlbumsByUserId(profile.id);
        setAlbums(albums);
      } catch (error) {
        console.error('Failed to fetch albums', error);
      }
    };

    const fetchFollowers = async () => {
      try {
        const followers = await getUserFollowersById(profile.id);
        setFollowers(followers);
      } catch (error) {
        console.error('Failed to fetch followers', error);
      }
    };

    const fetchFollows = async () => {
      try {
        const follows = await getUserFollowsById(profile.id);
        setFollows(follows);
      } catch (error) {
        console.error('Failed to fetch follows', error);
      }
    };

    fetchSongs();
    fetchAlbums();
    fetchFollowers();
    fetchFollows();
  }, [profile]);

  if (!profile) {
    return <Text>Loading...</Text>;
  }

  const handleFollow = async () => {
    try {
      await followUserById(profile.id);
      setIsFollowing(true);
      // Optionally, refresh followers
      const followers = await getUserFollowersById(profile.id);
      setFollowers(followers);
    } catch (error) {
      console.error('Failed to follow user', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUserById(profile.id);
      setIsFollowing(false);
      // Optionally, refresh followers
      const followers = await getUserFollowersById(profile.id);
      setFollowers(followers);
    } catch (error) {
      console.error('Failed to unfollow user', error);
    }
  };

  return (
    <ScrollView>
      <Card>
        <ProfileHeader
          user={profile}
          followers={followers.length}
          follows={follows.length}
          isCurrentUser={false}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      </Card>
      <Card>
        <Card.Title h3={true}>Songs</Card.Title>
        <Card.Divider />
        {songs.map(song => (
          <SongListItem
            key={String(song.id)}
            song={song}
            onPress={() => {
              setTracks(songs);
              setCurrentTrack(song);
              navigation.navigate('Player');
            }}
          />
        ))}
      </Card>
      <Card>
        <Card.Title h3={true}>Albums</Card.Title>
        <Card.Divider />
        <View style={styles.albumContainer}>
          {albums.map(album => (
            <AlbumCardItem
              key={String(album.id)}
              album={album}
              onPress={() => {
                // Handle album click if needed
              }}
            />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default Profile;
