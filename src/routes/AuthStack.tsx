import React from 'react';

import Register from '../screens/Register';
import Login from '../screens/Login';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

export const AuthStack = () => {
  return (
        <Tab.Navigator initialRouteName="Login">
                <Tab.Screen name="Login" component={Login}/>
                <Tab.Screen name="Registration" component={Register}/>
        </Tab.Navigator>
  );
};