import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Input, Text } from '@rneui/themed';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { UploadFileItem } from 'react-native-fs';
import { SongAdd } from '../../../api';
import { StackParamList } from './Settings';

const sendFileToServer = async (file: UploadFileItem, endpoint: string) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.filepath,
      name: file.filename,
      type: file.filetype,
    });

    const response = await fetch(`http://10.0.2.2:8000/file/upload/${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};


type ProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'AddSong'>;

function AddSong(): React.JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [audio, setAudio] = useState<UploadFileItem | null>(null);
  const [picture, setPicture] = useState<UploadFileItem | null>(null);

  const [loadingAudio, setLoadingAudio] = useState(false);
  const [loadingPicture, setLoadingPicture] = useState(false);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const postSong = async (song: SongAdd, audioData: UploadFileItem | null, pictureData: UploadFileItem | null) => {
    try {
      setLoadingAudio(true);
      setLoadingPicture(true);

      // const formData = new FormData();
      // formData.append('name', song.name);
      // formData.append('description', song.description);
      // formData.append('genre', song.genre);
      // formData.append('is_public', song.is_public.toString());
      // formData.append('background', song.background);

      // formData.append('audio_file ', {
      //   uri: audioData?.filepath,
      //   name: audioData?.filename,
      //   type: audioData?.filetype,
      // })

      // formData.append('image_file ', {
      //   uri: pictureData?.filepath,
      //   name: pictureData?.filename,
      //   type: pictureData?.filetype,
      // })


      // const response = await fetch(`http://10.0.2.2:8000/song/form/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   body: formData.toString(),
      // });

      const audioPath = audioData ? await sendFileToServer(audioData, 'audio') : null;
      console.log(audioPath);

      const imagePath = pictureData ? await sendFileToServer(pictureData, 'image') : null;
      console.log(imagePath);

      const response = await fetch(`http://10.0.2.2:8000/song/with_preupload/?audio_file=${audioPath ? audioPath.message : ''}&image_file=${imagePath ? imagePath.message : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      });


      if (!response.ok) {
        throw new Error('Failed to post song');
      }
      else {
        Alert.alert('Success!', 'Your song was successfully uploaded.', [
          { text: 'OK', onPress: () => navigation.navigate('Settings') },
        ]);
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error posting song:', error);
    } finally {
      setLoadingAudio(false);
      setLoadingPicture(false);
    }
  };

  const handleSongPost = () => {
    const song: SongAdd = {
      name,
      description,
      genre,
      is_public: isPublic,
      background: '',
    };

    postSong(song, audio, picture);
  };

  const handleFileSelect = async (setFile: React.Dispatch<React.SetStateAction<UploadFileItem | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setLoading(true);
      const result = await DocumentPicker.pickSingle({
        type: [types.audio, types.images],
      });

      const fileUri = result.uri;
      const fileType = result.type;
      const fileName = result.name;

      if (fileUri && fileType && fileName) {
        const file: UploadFileItem = {
          name: fileName,
          filename: fileName,
          filepath: fileUri,
          filetype: fileType,
        };
        setFile(file);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error picking file:', err);
      }
    } finally {
      setLoading(false);
    }
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
        <Text>{audio ? 'Audio selected' : 'No audio selected'}</Text>
        <Button
          title="Select Audio"
          onPress={() => handleFileSelect(setAudio, setLoadingAudio)}
        />
        {loadingAudio && <ActivityIndicator size="small" color="#0000ff" />}
        <Text>{picture ? 'Picture selected' : 'No picture selected'}</Text>
        <Button
          title="Select Picture"
          onPress={() => handleFileSelect(setPicture, setLoadingPicture)}
        />
        {loadingPicture && <ActivityIndicator size="small" color="#0000ff" />}
        <Card.Divider />
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
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default AddSong;
