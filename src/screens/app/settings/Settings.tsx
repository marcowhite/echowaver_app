import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, } from '@rneui/themed';
import { useAuth } from '../../../contexts/AuthContext';
import { track } from '@amplitude/analytics-react-native';


export type StackParamList = {
  Settings: undefined;
  AddSong: undefined;
  UpdateProfile: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Settings'>;

function Settings(): React.JSX.Element {
  const { signOut } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    track("Opened Settings");
  }), [];

  return (
    <ScrollView>
      <Card>
        <Button onPress={() => navigation.navigate("UpdateProfile")}>Edit profile</Button>
        <Card.Divider />
        <Button onPress={() => navigation.navigate("AddSong")}>Upload a new song</Button>
        <Card.Divider />
        <Button onPress={() => {
          track("Logged Out")
          signOut()
        }}>Logout</Button>
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

export default Settings;

