import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { UserProfile } from '../api';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../screens/app/feed/Feed';
//import DefaultUserImage from '@assets/images/default_user.jpg';

interface UserListItemProps {
  user: UserProfile;
  isFollowing: boolean;
  isCurrentUser: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, isFollowing, onFollow, onUnfollow, isCurrentUser }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const DefaultUserImage = require("./default_user.jpg")
  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Profile', { profile: user })}>
      <Image source={user.avatar === "null" ? { uri: `http://10.0.2.2:8000/file/image/${user.avatar}` } : DefaultUserImage} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.displayName}>{user.display_name}</Text>
        <Text style={styles.fullName}>{user.first_name} {user.last_name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {!isCurrentUser && (isFollowing ? (
          <Button onPress={onUnfollow} title="Unfollow" buttonStyle={styles.unfollowButton} />
        ) : (
          <Button onPress={onFollow} title="Follow" buttonStyle={styles.followButton} />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
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
    color: '#333',
  },
  fullName: {
    fontSize: 14,
    color: '#777',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  followButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  unfollowButton: {
    backgroundColor: '#F44336',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});

export default UserListItem;
