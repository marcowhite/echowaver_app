import React from 'react';

import Profile from '../screens/Profile';
import Feed from '../screens/Feed';
import AddSong from '../screens/AddSong';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab= createBottomTabNavigator();


export const AppStack = () => {
  return (
      <Tab.Navigator initialRouteName="Feed">
                <Tab.Screen
                    name="Feed"
                    component={Feed}
                />
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                />
                <Tab.Screen
                    name="Add Song"
                    component={AddSong}
                />
        </Tab.Navigator>
  );
};