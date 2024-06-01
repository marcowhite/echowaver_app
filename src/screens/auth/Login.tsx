import React, { useEffect, useState } from 'react';
import {
  Switch,
  View,
  ScrollView,
  StyleSheet,
  Image,

} from 'react-native';

import {   Button, Input} from '@rneui/themed';
import { Text } from '@rneui/themed';
import { Card } from '@rneui/themed';
import CookieManager, {Cookie} from '@react-native-cookies/cookies';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import { Image } from '@rneui/base';
import { postUserLogin } from '../../api';

export type AuthStackParamList = {
  Login: undefined,
  Registration: undefined,
};


function Login(): React.JSX.Element {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [secure, setSecure] = useState(false)

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    interface UserLogin {
      username: string;
      password: string;
    }  
    

    let postUser = (user: UserLogin) => {
      var data = new URLSearchParams();
      data.append('username', user.username);
      data.append('password', user.password);

      fetch(`http://10.0.2.2:8000/user/auth/jwt/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString()
      })
        .then((res) => {    
          console.log("Status",res.status);
          console.log("Headers",res.headers);
          let some = new Map(res.headers)
          console.log(some)

          const unparsedCookie = some.get('set-cookie') || ""
          const myCookie = unparsedCookie.split(';')[0];
          const [parsedName, parsedValue] = myCookie.split('=');

          const cookie: Cookie = {
            name: parsedName,
            value: parsedValue,
          };
    
          CookieManager.set('http://10.0.2.2:8000/', cookie).then((done) => {
            console.log('CookieManager.set =>', done);
          });
        });
    };
  
    const handleLogin = (username: string, password:string) => {
      const user: UserLogin = {
        username: username,
        password: password,
      };
      postUser(user);
      console.log(JSON.stringify({ 
        username : user.username, 
        password: user.password,
       }))
    };

    const toggleSecure = () => {
      setSecure(!secure); // Toggle the visibility of the password
    };

  
    return (
        <ScrollView>
            <Card>
              <Card.Image style ={styles.image} source={require('../auth/enter.jpeg')}></Card.Image>
            </Card>
            <Card>
              <Card.Title h3={true}>Welcome to Echowaver!</Card.Title>
              <Card.Title h4={true} style = {styles.welcomeText}>Echo your wave, share sound, discover new music. Connect with friends and artists. Dive into the wave of tunes!</Card.Title>
              <Card.Divider/>
              <Input leftIcon = {<Ionicons size = {24} name ='mail'/>} value={username} onChangeText={setUsername} placeholder="Email" />
              <Input leftIcon = {<Ionicons size = {24} name ='key'/>} value={password} secureTextEntry = {!secure}  onChangeText={setPassword} placeholder="Password" />
              <View style={styles.eyeIconContainer}>
                <Ionicons 
                  name={secure ? 'eye-off' : 'eye'} 
                  size={24} 
                  color="gray" 
                  onPress={toggleSecure} // Toggle password visibility onPress
                />
              </View>
              <Button onPress={() => handleLogin(username, password)} title="Login" />
              <Card.Divider/>
              <Button type="outline" onPress={() => navigation.navigate('Registration')} title="Sign up" />
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
    image: {
      borderRadius: 5,
    },
    welcomeText:{
      color: 'gray',
      marginTop: 1,
    },
    eyeIconContainer: {
      position: 'absolute',
      right: 17,
      top: 290, // Adjust this value as needed to align with the password input
    },
    button:{
      backgroundColor:'gray',
    }
  });

export default Login;