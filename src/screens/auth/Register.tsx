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
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type AuthStackParamList = {
  Login: undefined,
  Registration: undefined,
};

function Register(): React.JSX.Element {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [secure, setSecure] = useState(false)
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  
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
            navigation.navigate('Login')
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

    const toggleSecure = () => {
      setSecure(!secure); // Toggle the visibility of the password
    };

    return (
        <ScrollView>
            <Card>
              <Card.Image style ={styles.image} source={require('../auth/signup.jpeg')}></Card.Image>
            </Card>
            <Card>        
              <Card.Title h3={true}>Sign Up!</Card.Title>
              <Card.Divider/>
              <Input leftIcon = {<Ionicons size = {24} name ='mail'/>} value={email} onChangeText={setEmail} placeholder="Email" />
              <Input leftIcon = {<Ionicons size = {24} name ='key'/>} value={password} secureTextEntry = {!secure}  onChangeText={setPassword} placeholder="Password" />
              <View style={styles.eyeIconContainer}>
                <Ionicons 
                  name={secure ? 'eye-off' : 'eye'} 
                  size={24} 
                  color="gray" 
                  onPress={toggleSecure} // Toggle password visibility onPress
                />
              </View>
              <Input leftIcon = {<Ionicons size = {24} name ='person'/>} value={name} onChangeText={setName} placeholder="Name" />
              <Button onPress={() => handleRegister(name, email, password)} title="Register" />
            </Card>
        </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    eyeIconContainer: {
      position: 'absolute',
      right: 17,
      top: 162, // Adjust this value as needed to align with the password input
    },
    image: {
      borderRadius: 5,
    },
  });

export default Register;