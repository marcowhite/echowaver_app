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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

function Profile(): React.JSX.Element {
    const [profile, setProfile] = useState("");
    const [songs, setSongs] = useState("");
    const [albums, setAlbums] = useState("");

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
    
    let getSongById = (id: Int32) =>{
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

    let getAlbumById = (id: Int32) =>{
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

    getUserProfile()

    const user_id = 5

    return (
        <ScrollView>
            <Card>        
              <Card.Title h3={true}>Profile</Card.Title>
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