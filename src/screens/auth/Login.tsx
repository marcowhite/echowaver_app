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
import { NavigationProp, useNavigation } from '@react-navigation/native';

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
  
    return (
        <ScrollView>
            <Card>
              <Card.Title h3={true}>Welcome to Echowaver!</Card.Title>
              <Card.Title h4={true}>Echo your wave, share sound, discover new music. Connect with friends and artists. Dive into the wave of tunes!</Card.Title>
              <Card.Divider/>
              <Input value={username} onChangeText={setUsername} placeholder="Email" />
              <Input value={password} secureTextEntry = {!secure}  onChangeText={setPassword} placeholder="Password" />
              <View style = {styles.container}>
                <Switch value={secure} onValueChange={() => setSecure(!secure)}/>
                <Text></Text>
              </View>
              <Button onPress={() => handleLogin(username, password)} title="Login" />
              <Card.Divider/>
              <Button onPress={() => navigation.navigate('Registration')} title="Sign up" />
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

export default Login;