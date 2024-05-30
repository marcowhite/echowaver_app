import React, { useCallback, useEffect, useState } from 'react';
import {
  Switch,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Input, Button,  } from '@rneui/themed';
import { Text } from '@rneui/themed';
import { Card } from '@rneui/themed';
import { CardDivider } from '@rneui/base/dist/Card/Card.Divider';
import { pick } from 'react-native-document-picker';
import converter from "javascript-binary-converter";
import * as RNFS from 'react-native-fs';

function AddSong(): React.JSX.Element {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [genre, setGenre] = useState("")
    const [isPublic, setIsPublic] = useState(false)

    const [audio, setAudio] = useState("")
    const [picture, setPicture] = useState("")
  
    interface Song {
      name: string;
      description: string;
      genre: string;
      background: string;
      is_public: boolean;
    }
  
    
    let postSong = (song: Song) => {
      fetch(`http://10.0.2.2:8000/song/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: song.name, 
          description: song.description,
          genre: song.genre,
          background: '',
          is_public: song.is_public,
         }),
      })
        .then((res) => {
          console.log(res.status);
          console.log(res.headers);
          return res.json();
        })
        .then(
          (result) => {
            console.log(result);
          },
          (error) => {
            console.log(error);
          }
        );
    };
  
    const handleSongPost = (      
        name: string,
        description: string,
        genre: string,
        background: string,
        is_public: boolean
    ) => {
      const song: Song = {
        name: name,
        description: description,
        genre: genre,
        background: background,
        is_public: is_public
      };

      postSong(song);
    };
  
    return (
        <ScrollView>
            <Card>        
              <Card.Title h3={true}>Add Song</Card.Title>
              <Card.Divider/>
              <Input value={name} onChangeText={setName} placeholder="Name" />
              <Input value={description} onChangeText={setDescription} placeholder="Description" />
              <Input value={genre} onChangeText={setGenre} placeholder="Genre" />
              <View style = {styles.container}>
                <Switch value={isPublic} onValueChange={() => setIsPublic(!isPublic)}/>
                <Text>Public</Text>
              </View>
              <Text>{audio}</Text>
              <Button
                    title="Select Audio"
                    onPress={async () => {
                    try {
                        const [result] = await pick({
                        mode: 'open',
                        });
                        console.log(result);
                        setAudio(JSON.stringify(result));
                    } catch (err) {
                        // see error handling
                    }
                    }}
                />
                <Text>{picture}</Text>
                    <Button
                    title="Select Picture"
                    onPress={async () => {
                    try {
                        const [result] = await pick({
                        mode: 'open',
                        });
                        console.log(result);
                        const file = RNFS.readFileAssets(result.uri, "base-64");
                        // const bytes = await converter(file).toBytes();
                        setPicture(JSON.stringify(file));
                    } catch (err) {
                        // see error handling
                    }
                    }}
                />
              <Card.Divider/>
              <Button onPress={() => handleSongPost} title="Publish" />
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