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


function Register(): React.JSX.Element {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [secure, setSecure] = useState(false)

  
    interface UserRegister {
      name: string;
      email: string;
      password: string;
    }
  
    
    let postUser = (user: UserRegister) => {
      fetch(`http://10.0.2.2:8000/user/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          display_name: user.name, 
          email: user.email, 
          password: user.password,
          is_active: true,
          is_superuser: false,
          is_verified: false,
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
  
    const handleRegister = (name: string, email: string, password:string) => {
      const user: UserRegister = {
        name: name,
        email: email,
        password: password,
      };
      postUser(user);
    };
  
    return (
        <ScrollView>
            <Card>        
              <Card.Title h3={true}>Register</Card.Title>
              <Card.Divider/>
              <Input value={email} onChangeText={setEmail} placeholder="Email" />
              <Input value={password} secureTextEntry = {!secure}  onChangeText={setPassword} placeholder="Password" />
              <Input value={name} onChangeText={setName} placeholder="Name" />
              <View style = {styles.container}>
                <Switch value={secure} onValueChange={() => setSecure(!secure)}/>
                <Text></Text>
              </View>
              <Button onPress={() => handleRegister(name, email, password)} title="Register" />
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

export default Register;