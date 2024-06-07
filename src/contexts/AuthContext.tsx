import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthData, authService } from '../services/AuthService';
import CookieManager from '@react-native-cookies/cookies';
import { User, getCurrentUser } from '../api';
import { Identify, identify, reset, setUserId } from '@amplitude/analytics-react-native';

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
      console.error('Failed to load auth data from storage:', error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (username: string, password: string) => {
    try {
      const _authData = await authService.signIn(username, password);
      setAuthData(_authData);
      await AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));

      const userProfile = await getCurrentUser();
      await saveCurrentUser(userProfile);
      if (userProfile) {
        setUserId(userProfile.email);
        const identifyObj = new Identify()
          .set('display_name', userProfile.display_name)
          .set('first_name', userProfile.first_name)
          .set('last_name', userProfile.last_name)
          .set('city', userProfile.city)
          .set('bio', userProfile.bio)
          .set('url', userProfile.url)
          .set('avatar', userProfile.avatar)
          .set('background', userProfile.background)
          .set('spotlight', userProfile.spotlight);
        identify(identifyObj);
      }
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  };

  const saveCurrentUser = async (user: User) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem('@current_user', jsonValue);
    } catch (e) {
      console.error('Failed to save the user to AsyncStorage', e);
    }
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem('@AuthData');
    await AsyncStorage.removeItem('@current_user');
    await CookieManager.clearAll();
    reset()
  };

  return (
    <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
