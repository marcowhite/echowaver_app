import React from 'react';

import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Registration" component={Register} />
    </Stack.Navigator>
  );
};