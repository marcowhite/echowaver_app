  import React, { useEffect, useState } from 'react';
  import {
    Switch,
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
  } from 'react-native';
  import { Input, Button } from '@rneui/themed';
  import { Text } from '@rneui/themed';
  import { Card } from '@rneui/themed';
  import { pick } from 'react-native-document-picker';
  import * as RNFS from 'react-native-fs';
  import { SongAdd } from '../../../api';
  import { toByteArray } from 'base64-js';
  import { UploadFileItem} from 'react-native-fs';

  import { uploadFiles } from "react-native-fs";

  export async function sendImageToServer(file: any) {
          return uploadFiles({
              toUrl: `http://10.0.2.2:8000//file/upload/image`,
              files: file,
              method: "POST",
              headers: { Accept: "application/json" },
              begin: () => {
                  // console.log('File Uploading Started...')
              },
              progress: ({ totalBytesSent, totalBytesExpectedToSend }) => {
                  // console.log({ totalBytesSent, totalBytesExpectedToSend })
              },
          })
              .promise.then(({ body }) => {
                  // Response Here...
                  const data = JSON.parse(body);
                  console.log(data)
                  return data
              })
              .catch(_ => {
                 // console.log('Error')
              })
      }
  export async function sendAudioToServer(file: any) {
        return uploadFiles({
            toUrl: `http://10.0.2.2:8000//file/upload/audio`,
            files: file,
            method: "POST",
            headers: { Accept: "application/json" },
            begin: () => {
                console.log('File Uploading Started...')
            },
            progress: ({ totalBytesSent, totalBytesExpectedToSend }) => {
                console.log({ totalBytesSent, totalBytesExpectedToSend })
            },
        })
            .promise.then(({ body }) => {
                // Response Here...
                const data = JSON.parse(body);
                console.log(data)
                return data
            })
            .catch(error => {
               console.log(error)
            })
    }

  function AddSong(): React.JSX.Element {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const [audio, setAudio] = useState<UploadFileItem | null>(null);
    const [picture, setPicture] = useState<UploadFileItem | null>(null);

    const [loadingAudio, setLoadingAudio] = useState(false);
    const [loadingPicture, setLoadingPicture] = useState(false);

    const postSong = async (song: SongAdd, audioData: UploadFileItem | null, pictureData: UploadFileItem | null) => {
      try {
        setLoadingAudio(true);
        setLoadingPicture(true);

        const formData = new FormData();
        formData.append('name', song.name);
        formData.append('description', song.description);
        formData.append('genre', song.genre);
        formData.append('is_public', song.is_public.toString());

        const audio_path: string = await sendAudioToServer([audioData])
        console.log(audio_path)
        // formData.append('audio_file', audio_path);

        const image_path: string = await sendImageToServer([pictureData])
        console.log(image_path)
        // formData.append('audio_file', image_path);

        const response = await fetch(`http://10.0.2.2:8000/song/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
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
                const fileType = result[0]?.type;
                const fileName = result[0]?.name;
                if (fileUri) {
                  if (fileUri&&fileType&&fileName){
                    const file: UploadFileItem = {
                      name: fileName,
                      filename: fileName,
                      filepath: fileUri, 
                      filetype: fileType,
                    }
                    setAudio(file);
                  }

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
                const fileType = result[0]?.type;
                const fileName = result[0]?.name;
                if (fileUri) {
                  if (fileUri&&fileType&&fileName){
                    const file: UploadFileItem = {
                      name: fileName,
                      filename: fileName,
                      filepath: fileUri, 
                      filetype: fileType,
                    }
                    setPicture(file);
                  }
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
          <Button onPress={() => console.log(sendAudioToServer([audio]))} title="Publish" />
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
