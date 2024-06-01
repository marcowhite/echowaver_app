import React, { useEffect, useState } from 'react';
import {
  Switch,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Input, Button,  } from '@rneui/themed';
import { Text } from '@rneui/themed';
import { Card } from '@rneui/themed';
import CookieManager, {Cookie} from '@react-native-cookies/cookies';
import { useNavigation, NavigationProp, useNavigationContainerRef } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


// Определите типы параметров для стека навигации
type StackParamList = {
  UserPage: undefined;
  AddSong: undefined;
  // Добавьте здесь другие экраны, если необходимо
};

// Определите тип навигации для экрана Profile
type ProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'UserPage'>;

function Profile(): React.JSX.Element{
    const [profile, setProfile] = useState("");
    const [songs, setSongs] = useState("");
    const [albums, setAlbums] = useState("");

    const navigation = useNavigation<ProfileScreenNavigationProp>();

      useEffect(() => {
        getUserProfile();
    }, []);

    let getUserProfile = () =>{
      console.log(CookieManager.getAll)
      const output = fetch(`http://10.0.2.2:8000/user/auth/me`, {
        method: 'GET',

      })
        .then((res) => {
          console.log("status",res.status);
          console.log("headers", res.headers);
          return res.json();
        })
        .then(
          (result) => {
            console.log(result);
            setProfile(JSON.stringify(result))
          },
          (error) => {
            console.log(error);
          }
        );
    }
    
    let getSongById = (id: number) =>{
        console.log(CookieManager.getAll)
        const output = fetch(`http://10.0.2.2:8000/song/`, {
          method: 'GET',
  
        })
          .then((res) => {
            console.log("status",res.status);
            console.log("headers", res.headers);
            return res.json();
          })
          .then(
            (result) => {
              console.log(result);
              setSongs(JSON.stringify(result))
            },
            (error) => {
              console.log(error);
            }
          );
      }

    let getAlbumById = (id: number) =>{
        console.log(CookieManager.getAll)
        const output = fetch(`http://10.0.2.2:8000/album/`, {
          method: 'GET',
  
        })
          .then((res) => {
            console.log("status",res.status);
            console.log("headers", res.headers);
            return res.json();
          })
          .then(
            (result) => {
              console.log(result);
              setAlbums(JSON.stringify(result))
            },
            (error) => {
              console.log(error);
            }
          );
      }

    const user_id = 5

    return (
        <ScrollView>
            <Card>        
              <Card.Title h3={true}>Profile</Card.Title>
              <Card.Divider/>
              <Button onPress={() => navigation.navigate("AddSong")}>Upload a new song</Button>
              <Card.Divider/>
              <Button onPress={getUserProfile}>Update</Button>
              <Text>{profile}</Text>
            </Card>
            <Card>        
              <Card.Title h3={true}>User Songs</Card.Title>
              <Card.Divider/>
              <Button onPress={() => getSongById(user_id)}>Update</Button>
              <Text>{songs}</Text>
            </Card>
            <Card>        
              <Card.Title h3={true}>User Songs</Card.Title>
              <Card.Divider/>
              <Button onPress={() => getAlbumById(user_id)}>Update</Button>
              <Text>{albums}</Text>
            </Card>
            <Card>        
              <Card.Title h3={true}>Add Song</Card.Title>
              <Card.Divider/>
              
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

export default Profile;