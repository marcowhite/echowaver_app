import React from 'react';

import Profile from '../screens/Profile';
import Feed from '../screens/Feed';
import AddSong from '../screens/AddSong';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Player from '../screens/Player';

const Tab= createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileNavigator = () =>{
    return(
        <Stack.Navigator>
            <Stack.Screen name = 'Profile' component={Profile}/>
            <Stack.Screen name = 'AddSong' component={AddSong} options={{ title: 'Upload a song' }}/>
        </Stack.Navigator>
    );
}

export const AppStack = () => {
  return (
      <Tab.Navigator initialRouteName="Feed">
                <Tab.Screen
                    name="Feed"
                    component={Feed}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileNavigator}>
                </Tab.Screen>
        </Tab.Navigator>
  );
};