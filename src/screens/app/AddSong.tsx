import React, { useEffect, useState } from 'react';
import {
  Switch,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Input, Button, } from '@rneui/themed';
import { Text } from '@rneui/themed';
import { Card } from '@rneui/themed';
import { CardDivider } from '@rneui/base/dist/Card/Card.Divider';
import { pick } from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';
import { SongAdd } from '../../api';

function AddSong(): React.JSX.Element {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [genre, setGenre] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  const [audio, setAudio] = useState<string | null>(null);
  const [picture, setPicture] = useState<string | null>(null);

  const [loadingAudio, setLoadingAudio] = useState(false);
  const [loadingPicture, setLoadingPicture] = useState(false);

  const postSong = async (song: SongAdd, audioData: string | null, pictureData: string | null) => {
    try {
      setLoadingAudio(true);
      setLoadingPicture(true);
      const response = await fetch(`http://10.0.2.2:8000/song/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...song,
          audio: audioData,
          picture: pictureData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post song');
      }

      const result = await response.json();
      console.log(result);
      setLoadingAudio(false);
      setLoadingPicture(false);
    } catch (error) {
      console.error(error);
      setLoadingAudio(false);
      setLoadingPicture(false);
    }
  };

  const handleSongPost = () => {
    const song: SongAdd = {
      name: name,
      description: description,
      genre: genre,
      is_public: isPublic,
      background: '',
    };

    postSong(song, audio, picture);
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title h3={true}>Add Song</Card.Title>
        <Card.Divider />
        <Input value={name} onChangeText={setName} placeholder="Name" />
        <Input value={description} onChangeText={setDescription} placeholder="Description" />
        <Input value={genre} onChangeText={setGenre} placeholder="Genre" />
        <View style={styles.container}>
          <Switch value={isPublic} onValueChange={() => setIsPublic(!isPublic)} />
          <Text>Public</Text>
        </View>
        <Text>{audio ? true : false}</Text>
        <Button
          title="Select Audio"
          onPress={async () => {
            try {
              setLoadingAudio(true);
              const result = await pick({
                mode: 'open',
              });
              const fileUri = result[0]?.uri;
              if (fileUri) {
                const fileData = await RNFS.readFile(fileUri, 'base64');
                setAudio(fileData);
              }
              setLoadingAudio(false);
            } catch (err) {
              console.error(err);
              setLoadingAudio(false);
            }
          }}
        />
        {loadingAudio && <ActivityIndicator size="small" color="#0000ff" />}
        <Text>{picture ? true : false}</Text>
        <Button
          title="Select Picture"
          onPress={async () => {
            try {
              setLoadingPicture(true);
              const result = await pick({
                mode: 'open',
              });
              const fileUri = result[0]?.uri;
              if (fileUri) {
                const fileData = await RNFS.readFile(fileUri, 'base64');
                setPicture(fileData);
              }
              setLoadingPicture(false);
            } catch (err) {
              console.error(err);
              setLoadingPicture(false);
            }
          }}
        />
        {loadingPicture && <ActivityIndicator size="small" color="#0000ff" />}
        <Card.Divider></Card.Divider>
        <Button onPress={handleSongPost} title="Publish" />
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

export default AddSong;
