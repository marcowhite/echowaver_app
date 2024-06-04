import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Settings from '../screens/app/settings/Settings';
import Feed from '../screens/app/feed/Feed';
import AddSong from '../screens/app/settings/AddSong';
import Player from '../screens/app/feed/Player';
import { PlayerProvider } from "../contexts/PlayerContext"
import Profile from '../screens/app/feed/Profile';
import FollowersOrFollowing from '../screens/app/feed/Follow';
import MiniPlayer from '../components/MiniPlayer';
import Library from '../screens/app/feed/Library';
import { LikeProvider } from '../contexts/LikeContext';
import UpdateProfile from '../screens/app/settings/UpdateProfile';
import { UserProvider } from '../contexts/UserContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Settings' component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name='AddSong' component={AddSong} options={{ title: 'Upload a song' }} />
            <Stack.Screen name='UpdateProfile' component={UpdateProfile} options={{ title: 'Update profile' }} />
        </Stack.Navigator>
    );
}

const FeedNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='MainFeed' component={Feed} options={{ headerShown: false }} />
            <Stack.Screen name='Player' component={Player} options={{ title: 'Player' }} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='FollowersOrFollowing' component={FollowersOrFollowing} options={{ title: 'Users' }} />
        </Stack.Navigator>
    );
}

export const AppStack = () => {
    return (
        <UserProvider>
            <LikeProvider>
                <PlayerProvider>
                    <Tab.Navigator
                        initialRouteName="Feed"
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ color, size }) => {
                                let iconName: string;

                                if (route.name === 'Feed') {
                                    iconName = 'newspaper'; // Ionicons name for feed icon
                                } else if (route.name === 'SettingsNavigator') {
                                    iconName = 'settings'; // Ionicons name for profile icon
                                } else if (route.name === 'Library') {
                                    iconName = 'library'; // Ionicons name for profile icon
                                } else {
                                    iconName = 'help-circle'; // Default icon
                                }

                                return <Ionicons name={iconName} size={size} color={color} />;
                            },
                        })}
                    >
                        <Tab.Screen name="Feed" component={FeedNavigator} />
                        <Tab.Screen name="Library" component={Library} />
                        <Tab.Screen name="SettingsNavigator" component={SettingsNavigator} options={{ title: 'Settings' }} />
                    </Tab.Navigator>
                </PlayerProvider>
            </LikeProvider>
        </UserProvider>
    );
};


