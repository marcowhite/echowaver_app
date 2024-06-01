import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/Loading';

export const Router = () => {
  const { authData, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }
  return (
    <NavigationContainer>
      {/* {authData ? <AppStack /> : <AuthStack />} */}
      {false ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};