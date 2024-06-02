import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { User } from '../api';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  isFollowing: boolean;
  onEditProfile: () => void;
  onFollow: () => void;
  onUnfollow: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isCurrentUser, isFollowing, onEditProfile, onFollow, onUnfollow }) => {
  return (
    <View style={styles.container}>
      <Image source={ user.avatar === "null" ?  { uri: `http://10.0.2.2:8000/file/image/${user.avatar}` } : require("../components/default_user.jpg")} style={styles.avatar}/>
      <View style={styles.infoContainer}>
        <Text style={styles.displayName}>{user.display_name}</Text>
        <Text style={styles.fullName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.city}>{user.city}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>0</Text> 
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>0</Text> 
          <Text style={styles.statLabel}>Follows</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {isCurrentUser ? (
          <Button onPress={onEditProfile} title="Edit Profile" />
        ) : isFollowing ? (
          <Button onPress={onUnfollow} title="Unfollow" />
        ) : (
          <Button onPress={onFollow} title="Follow" />
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 16,
    color: '#555',
  },
  city: {
    fontSize: 14,
    color: '#777',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
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
  bio: {
    textAlign: 'center',
    color: '#777',
  },
});

export default ProfileHeader;
