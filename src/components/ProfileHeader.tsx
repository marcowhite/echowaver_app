import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { UserProfile } from '../api';
import { RootStackParamList } from '../screens/app/feed/Feed';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface ProfileHeaderProps {
  user: UserProfile;
  followers: number;
  follows: number;
  isCurrentUser: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, followers, follows, isCurrentUser, isFollowing, onFollow, onUnfollow }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const DefaultUserImage = require("./default_user.jpg");

  return (
    <View style={styles.container}>
      <Image
        source={user.avatar && user.avatar !== "null" && user.avatar !== "" ?
          { uri: `http://10.0.2.2:8000/file/image/${user.avatar}` } :
          DefaultUserImage}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.displayName}>{user.display_name}</Text>
        <Text style={styles.fullName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.city}>{user.city}</Text>
      </View>
      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('FollowersOrFollowing', { profile: user, type: 'followers' })}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FollowersOrFollowing', { profile: user, type: 'following' })}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{follows}</Text>
            <Text style={styles.statLabel}>Follows</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        {isCurrentUser ? null : isFollowing ? (
          <Button onPress={onUnfollow} title="Unfollow" buttonStyle={styles.unfollowButton} />
        ) : (
          <Button onPress={onFollow} title="Follow" buttonStyle={styles.followButton} />
        )}
      </View>
      <Text style={styles.bio}>{user.bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  fullName: {
    fontSize: 18,
    color: '#555',
  },
  city: {
    fontSize: 16,
    color: '#777',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  unfollowButton: {
    backgroundColor: '#F44336',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  bio: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    paddingHorizontal: 20,
  },
});

export default ProfileHeader;
