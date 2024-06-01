import React from 'react';

import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
    initialRouteName="Login">
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Registration" component={Register}/>
</Stack.Navigator>
  );
};

{/* <Tab.Navigator
initialRouteName="Login"
screenOptions={({ route }) => ({
  tabBarIcon: ({ color, size }) => {
    let iconName: string = '';

    if (route.name === 'Login') {
      iconName = 'log-in';
    } else if (route.name === 'Registration') {
      iconName = 'person-add';
    } else {
      // Provide a default icon name to avoid TypeScript error
      iconName = 'alert-circle';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
})}
>
    <Tab.Screen name="Login" component={Login}/>
    <Tab.Screen name="Registration" component={Register}/>
</Tab.Navigator> */}