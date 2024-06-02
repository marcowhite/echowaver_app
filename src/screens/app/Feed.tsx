// screens/Feed.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getSongs, getAlbums, Song, Album } from '../../api';
import SongListItem from '../../components/SongListItem';
import AlbumCardItem from '../../components/AlbumCardItem'; // Import the new component
import { usePlayer } from '../../contexts/PlayerContext';

export type RootStackParamList = {
  MainFeed: undefined;
  Player: undefined;
  Profile: undefined;
  AddSong: undefined;
};

function Feed(): React.JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tracks, currentTrack, setCurrentTrack, setTracks } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getSongs();
        setSongs(songs);
      } catch (error) {
        console.error('Failed to fetch songs', error);
      }
    };

    const fetchAlbums = async () => {
      try {
        const albums = await getAlbums();
        setAlbums(albums);
      } catch (error) {
        console.error('Failed to fetch albums', error);
      }
    };

    fetchSongs();
    fetchAlbums();
  }, []);

  return (
    <ScrollView>
      <Card>
        <Card.Title h3={true}>Songs</Card.Title>
        <Card.Divider />
        {songs.map(song => (
          <SongListItem
            key={String(song.id)}
            song={song}
            onPress={() => {
              setTracks(songs);
              setCurrentTrack(song);
              navigation.navigate('Player');
            }}
          />
        ))}
      </Card>
      <Card>
        <Card.Title h3={true}>Albums</Card.Title>
        <Card.Divider />
        <View style={styles.albumContainer}>
          {albums.map(album => (
            <AlbumCardItem
              key={String(album.id)}
              album={album}
              onPress={() => {
                // Handle album click if needed
              }}
            />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  albumContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Feed;
