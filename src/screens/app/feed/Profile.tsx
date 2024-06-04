import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card } from '@rneui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import ProfileHeader from '../../../components/ProfileHeader';
import { Album, Song, UserProfile, getAlbumsByUserId, getSongsByUserId, getUserFollowersById, getUserFollowsById, followUserById, unfollowUserById } from '../../../api';
import { RootStackParamList } from './Feed';
import { usePlayer } from '../../../contexts/PlayerContext';
import { useUser } from '../../../contexts/UserContext';
import AlbumsCard from '../../../components/AlbumsCard';
import SongsCard from '../../../components/SongsCard';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

function Profile(): React.JSX.Element {
  const route = useRoute<ProfileScreenRouteProp>();
  const { profile } = route.params;
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [follows, setFollows] = useState<UserProfile[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { currentUser, refreshCurrentUser } = useUser();
  const { tracks, currentTrack, setCurrentTrack, setTracks } = usePlayer();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = async () => {
    if (!profile) return;

    try {
      const [songs, albums, followers, follows] = await Promise.all([
        getSongsByUserId(profile.id),
        getAlbumsByUserId(profile.id),
        getUserFollowersById(profile.id),
        getUserFollowsById(profile.id),
      ]);

      setSongs(songs);
      setAlbums(albums);
      setFollowers(followers);
      setFollows(follows);

      if (currentUser) {
        setIsFollowing(followers.some((follower: { id: number; }) => follower.id === currentUser.id));
      }
    } catch (error) {
      console.error('Failed to load profile data', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [profile]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      await followUserById(profile.id);
      setIsFollowing(true);
      const updatedFollowers = await getUserFollowersById(profile.id);
      setFollowers(updatedFollowers);
      await refreshCurrentUser();
    } catch (error) {
      console.error('Failed to follow user', error);
    }
  };

  const handleUnfollow = async () => {
    if (!profile) return;
    try {
      await unfollowUserById(profile.id);
      setIsFollowing(false);
      const updatedFollowers = await getUserFollowersById(profile.id);
      setFollowers(updatedFollowers);
      await refreshCurrentUser();
    } catch (error) {
      console.error('Failed to unfollow user', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  if (!profile) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card>
        <ProfileHeader
          user={profile}
          followers={followers.length}
          follows={follows.length}
          isCurrentUser={currentUser?.id === profile.id}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      </Card>
      <SongsCard songs={songs} />
      {/* <AlbumsCard albums={albums} /> */}
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
