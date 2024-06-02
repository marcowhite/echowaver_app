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
import { useNavigation, NavigationProp, useNavigationContainerRef } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from '../../components/ProfileHeader';
import { Album, Song, User, getAlbumsByUserId, getSongsByUserId, getUsers } from '../../api';


// Определите типы параметров для стека навигации
type StackParamList = {
  UserPage: undefined;
  AddSong: undefined;
  // Добавьте здесь другие экраны, если необходимо
};

// Определите тип навигации для экрана Profile
type ProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'UserPage'>;

function Profile(): React.JSX.Element{
    const [profile, setProfile] = useState<User | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const {signOut} = useAuth();
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const userProfile = await getUsers();
          setProfile(userProfile);
        } catch (error) {
          console.error('Failed to fetch profile', error);
        }
      };
      
      fetchProfile();
    }, []);

    // useEffect(() => {
    //   const fetchSongs = async () => {
    //     try {
    //       const songs = await getSongsByUserId(profile.id);
    //       setSongs(songs);
    //     } catch (error) {
    //       console.error('Failed to fetch songs', error);
    //     }
    //   };
  
    //   const fetchAlbums = async () => {
    //     try {
    //       const albums = await getAlbumsByUserId(profile.id);
    //       setAlbums(albums);
    //     } catch (error) {
    //       console.error('Failed to fetch albums', error);
    //     }
    //   };
  
    //   fetchSongs();
    //   fetchAlbums();
    // }, []);

  
    if (!profile) {
      return <Text>Loading...</Text>;
    }
  
    const handleEditProfile = () => {
      // Handle profile editing
    };
  
    const handleFollow = () => {
      // Handle follow action
    };
  
    const handleUnfollow = () => {
      // Handle unfollow action
    };
  
    // const isCurrentUser = user?.id === profile.id;
    const isFollowing = false; // Replace with logic to check if the current user is following the profile user

    return (
        <ScrollView>
            <Card>
              <ProfileHeader
                user={profile}
                isCurrentUser={true}
                isFollowing={isFollowing}
                onEditProfile={handleEditProfile}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
              />
            </Card>

            <Button onPress={() => navigation.navigate("AddSong")}>Upload a new song</Button>
            <Button onPress={signOut}>Logout</Button>
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

