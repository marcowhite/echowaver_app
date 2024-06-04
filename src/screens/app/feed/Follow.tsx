import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { UserProfile, followUserById, unfollowUserById, getUserFollowersById, getUserFollowsById } from '../../../api';
import UserListItem from '../../../components/UserListItem';
import { RootStackParamList } from './Feed';
import { useUser } from '../../../contexts/UserContext';
import { track } from '@amplitude/analytics-react-native';

type FollowersOrFollowingScreenRouteProp = RouteProp<RootStackParamList, 'FollowersOrFollowing'>;

function FollowersOrFollowing(): React.JSX.Element {
  const route = useRoute<FollowersOrFollowingScreenRouteProp>();
  const { profile, type } = route.params;
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<Set<number>>(new Set());
  const { currentUser, refreshCurrentUser } = useUser();
  const [currentUserFollows, setCurrentUserFollows] = useState<Set<number>>(new Set());
  const [currentUserFollowers, setCurrentUserFollowers] = useState<Set<number>>(new Set());

  const fetchUsers = async () => {
    try {
      let fetchedUsers: UserProfile[];
      if (type === 'followers') {
        fetchedUsers = await getUserFollowersById(profile.id);
        track("Opened Followers", { userId: profile.id })
      } else {
        fetchedUsers = await getUserFollowsById(profile.id);
        track("Opened Follows", { userId: profile.id })
      }
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchCurrentUserFollowsAndFollowers = async () => {
    try {
      if (currentUser) {
        const [follows, followers] = await Promise.all([
          getUserFollowsById(currentUser.id),
          getUserFollowersById(currentUser.id)
        ]);

        setCurrentUserFollows(new Set(follows.map((user: { id: any; }) => user.id)));
        setCurrentUserFollowers(new Set(followers.map((user: { id: any; }) => user.id)));
      }
    } catch (error) {
      console.error('Failed to fetch current user follows and followers', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUserFollowsAndFollowers();
  }, []);

  const handleFollow = async (userId: number) => {
    try {
      await followUserById(userId);
      setFollowing(prev => new Set(prev).add(userId));
      setCurrentUserFollows(prev => new Set(prev).add(userId));
      await refreshCurrentUser();
      track('Follow User', { userId: userId });
    } catch (error) {
      console.error('Failed to follow user', error);
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await unfollowUserById(userId);
      setFollowing(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
      setCurrentUserFollows(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
      await refreshCurrentUser();
      track('Unfollow User', { userId: userId });
    } catch (error) {
      console.error('Failed to unfollow user', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {users.map(user => (
        <UserListItem
          key={user.id}
          user={user}
          isCurrentUser={currentUser?.id === user.id}
          isFollowing={currentUserFollows.has(user.id)}
          onFollow={() => handleFollow(user.id)}
          onUnfollow={() => handleUnfollow(user.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default FollowersOrFollowing;
