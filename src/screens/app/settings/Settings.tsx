import React from 'react';
import {
  ScrollView,
  StyleSheet
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, } from '@rneui/themed';
import { useAuth } from '../../../contexts/AuthContext';


export type StackParamList = {
  Settings: undefined;
  AddSong: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Settings'>;

function Settings(): React.JSX.Element {
  const { signOut } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  return (
    <ScrollView>
      <Card>
        <Button onPress={() => navigation.navigate("AddSong")}>Upload a new song</Button>
        <Card.Divider />
        <Button onPress={signOut}>Logout</Button>
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

