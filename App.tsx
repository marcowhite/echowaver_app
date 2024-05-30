
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './src/components/Register';
import Login from './src/components/Login';
import Profile from './src/components/Profile';
import Feed from './src/components/Feed';
import AddSong from './src/components/AddSong';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from '@rneui/base';
import CookieManager from '@react-native-cookies/cookies';
import { Input } from '@rneui/themed';

const Stack = createNativeStackNavigator();

const TabAuth = createBottomTabNavigator();


function App(): React.JSX.Element {
  // let cookies = CookieManager.get('http://10.0.2.2:8000/');
  return (
    <NavigationContainer>
      <TabAuth.Navigator initialRouteName="Login">
                <TabAuth.Screen
                    name="Login"
                    component={Login}
                />
                <TabAuth.Screen
                    name="Registration"
                    component={Register}
                />
                <TabAuth.Screen
                    name="Profile"
                    component={Profile}
                />
                <TabAuth.Screen
                    name="Feed"
                    component={Feed}
                />
                <TabAuth.Screen
                    name="Add Song"
                    component={AddSong}
                />
            </TabAuth.Navigator>
    </NavigationContainer>
  );
}


export default App;

