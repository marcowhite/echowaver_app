import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Album, UserProfile, getUserProfile } from '../api';

interface AlbumCardItemProps {
  album: Album;
  onPress: () => void;
}

const AlbumCardItem: React.FC<AlbumCardItemProps> = ({ album, onPress }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile(album.user_id);
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, [album.user_id]);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: `http://10.0.2.2:8000/file/image/${album.cover_file}` }} style={styles.coverImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{album.name}</Text>
        <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">{`${profile?.display_name}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '48%', // To have two items per row
    margin: '1%',
  },
  coverImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 3,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  author: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default AlbumCardItem;
