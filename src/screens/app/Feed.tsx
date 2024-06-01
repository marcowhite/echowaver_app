import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Button as RNButton } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getSongs, getAlbums, Song } from '../../api';
import SongListItem from '../../components/SongListItem';
import {PlayerProvider, usePlayer} from '../../contexts/PlayerContext'

export type RootStackParamList = {
  MainFeed: undefined;
  Player: undefined
  Profile: undefined;
  AddSong: undefined;
};

function Feed(): React.JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<string>('');
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

    fetchSongs();
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
                setTracks(songs)
                setCurrentTrack(song)
                navigation.navigate('Player')
              } }
            />
          ))}
      </Card>
      <Card>
        <Card.Title h3={true}>Albums</Card.Title>
        <Card.Divider />
        <Button onPress={async () => {
          const result = await getAlbums();
          setAlbums(JSON.stringify(result));
        }}>Update</Button>
        <Text>{albums}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Feed;
