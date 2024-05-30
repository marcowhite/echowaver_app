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

function Feed(): React.JSX.Element {
    const [songs, setSongs] = useState("");
    const [albums, setAlbums] = useState("");
    
    let getSongs = () =>{
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

    let getAlbums = () =>{
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

    return (
        <ScrollView>
            <Card>        
              <Card.Title h3={true}>Songs</Card.Title>
              <Card.Divider/>
              <Button onPress={getSongs}>Update</Button>
              <Text>{songs}</Text>
            </Card>
            <Card>        
              <Card.Title h3={true}>Albums</Card.Title>
              <Card.Divider/>
              <Button onPress={getAlbums}>Update</Button>
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