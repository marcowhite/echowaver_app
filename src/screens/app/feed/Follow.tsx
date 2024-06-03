import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { UserProfile, followUserById, unfollowUserById, getUserFollowersById, getUserFollowsById } from '../../../api';
import UserListItem from '../../../components/UserListItem';
import { RootStackParamList } from './Feed';

type FollowersOrFollowingScreenRouteProp = RouteProp<RootStackParamList, 'FollowersOrFollowing'>;

function FollowersOrFollowing(): React.JSX.Element {
  const route = useRoute<FollowersOrFollowingScreenRouteProp>();
  const { profile, type } = route.params;
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<Set<number>>(new Set());

  const fetchUsers = async () => {
    try {
      let fetchedUsers: UserProfile[];
      if (type === 'followers') {
        fetchedUsers = await getUserFollowersById(profile.id);
      } else {
        fetchedUsers = await getUserFollowsById(profile.id);
      }
      setUsers(fetchedUsers);

      // You can implement an API call to check following status here
      // and set the following state accordingly
      // const followingIds = fetchedUsers.filter(user => user.is_following).map(user => user.id);
      // setFollowing(new Set(followingIds));
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFollow = async (userId: number) => {
    try {
      await followUserById(userId);
      setFollowing(prev => new Set(prev).add(userId));
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
          isFollowing={following.has(user.id)}
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
