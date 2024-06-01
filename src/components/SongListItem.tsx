import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Song } from '../api';



interface SongListItemProps {
  song: Song;
  onPress: () => void;
}

const SongListItem: React.FC<SongListItemProps> = ({ song, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: `http://10.0.2.2:8000/file/image/${song.cover_file}` }} style={styles.coverImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{song.name}</Text>
        <Text style={styles.author}>{`Author: ${song.user_id}`}</Text>
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
