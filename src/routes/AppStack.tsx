import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Profile from '../screens/app/Profile';
import Feed from '../screens/app/Feed';
import AddSong from '../screens/app/AddSong';
import Player from '../screens/app/Player';
import {PlayerProvider} from "../contexts/PlayerContext"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='UserPage' component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='AddSong' component={AddSong} options={{ title: 'Upload a song' }} />
        </Stack.Navigator>
    );
}

const FeedNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='MainFeed' component={Feed} options={{ headerShown: false }} />
            <Stack.Screen name='Player' component={Player} options={{ title: 'Player' }} />
        </Stack.Navigator>
    );
}

export const AppStack = () => {
    return (
        <PlayerProvider>
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;

                    if (route.name === 'Feed') {
                        iconName = 'home'; // Ionicons name for feed icon
                    } else if (route.name === 'Profile') {
                        iconName = 'person'; // Ionicons name for profile icon
                    } else {
                        iconName = 'help-circle'; // Default icon
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Feed" component={FeedNavigator} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
        </Tab.Navigator>
        </PlayerProvider>

    );
};


