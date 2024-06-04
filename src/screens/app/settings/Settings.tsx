import React, { useEffect, useState } from 'react';
import {
  Switch,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Input, Button, } from '@rneui/themed';
import { Text } from '@rneui/themed';
import { Card } from '@rneui/themed';
import CookieManager, { Cookie } from '@react-native-cookies/cookies';
import { useNavigation, NavigationProp, useNavigationContainerRef } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../../contexts/AuthContext';
import ProfileHeader from '../../../components/ProfileHeader';
import { Album, Song, User, getAlbumsByUserId, getCurrentUser, getSongsByUserId } from '../../../api';
import { Divider } from '@rneui/base';
import Profile from '../feed/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';


type StackParamList = {
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

