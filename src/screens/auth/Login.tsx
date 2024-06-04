import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Button, Input, Text, Card } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
// import EnterImage from '@assets/images/enter.jpeg';

export type AuthStackParamList = {
  Login: undefined;
  Registration: undefined;
};

function Login(): React.JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(false);
  const { signIn } = useAuth();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const EnterImage = require('./enter.jpeg')
  const handleLogin = async (username: string, password: string) => {
    try {
      await signIn(username, password);
    } catch (error) {
      Alert.alert('Login failed', 'Invalid username or password');
    }
  };

  const toggleSecure = () => {
    setSecure(!secure); // Toggle the visibility of the password
  };

  return (
    <ScrollView>
      <Card>
        <Card.Image style={styles.image} source={EnterImage}></Card.Image>
      </Card>
      <Card>
        <Card.Title h3={true}>Welcome to Echowaver!</Card.Title>
        <Card.Title h4={true} style={styles.welcomeText}>
          Echo your wave, share sound, discover new music. Connect with friends and artists. Dive into the wave of tunes!
        </Card.Title>
        <Card.Divider />
        <Input leftIcon={<Ionicons size={24} name='mail' />} value={username} onChangeText={setUsername} placeholder="Email" />
        <Input leftIcon={<Ionicons size={24} name='key' />} value={password} secureTextEntry={!secure} onChangeText={setPassword} placeholder="Password" />
        <View style={styles.eyeIconContainer}>
          <Ionicons
            name={secure ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
            onPress={toggleSecure}
          />
        </View>
        <Button onPress={() => handleLogin(username, password)} title="Login" />
        <Card.Divider />
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
  welcomeText: {
    color: 'gray',
    marginTop: 1,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 17,
    top: 290, // Adjust this value as needed to align with the password input
  },
  button: {
    backgroundColor: 'gray',
  },
});

export default Login;
