import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { UserProfile } from '../api';

interface UserListItemProps {
  user: UserProfile;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, isFollowing, onFollow, onUnfollow }) => {
  return (
    <View style={styles.container}>
      <Image source={ user.avatar === "null" ? { uri: `http://10.0.2.2:8000/file/image/${user.avatar}` } : require("./default_user.jpg")} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.displayName}>{user.display_name}</Text>
        <Text style={styles.fullName}>{user.first_name} {user.last_name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {isFollowing ? (
          <Button onPress={onUnfollow} title="Unfollow" buttonStyle={styles.unfollowButton} />
        ) : (
          <Button onPress={onFollow} title="Follow" buttonStyle={styles.followButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
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
});

export default UserListItem;
