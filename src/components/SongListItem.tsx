import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Song } from '../api';
import { useEffect, useState } from 'react';
import { UserProfile, getUserProfile } from '../api';


interface SongListItemProps {
  song: Song;
  onPress: () => void;
}

const SongListItem: React.FC<SongListItemProps> = ({ song, onPress }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile(song.user_id);
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, [song.user_id]);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: `http://10.0.2.2:8000/file/image/${song.cover_file}` }} style={styles.coverImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{song.name}</Text>
        <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">{`${profile?.display_name}`}</Text>
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
    borderBottomColor: '#ccc',
  },
  coverImage: {
    width: 65,
    height: 65,
    borderRadius: 3,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#888',
  },
});

export default SongListItem;
