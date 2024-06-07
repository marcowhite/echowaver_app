import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, getCurrentUser } from '../api';
import { Identify, identify, setUserId } from '@amplitude/analytics-react-native';

interface UserContextType {
    currentUser: User | null;
    setCurrentUser: (user: User) => void;
    refreshCurrentUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const refreshCurrentUser = async () => {
        try {
            const refreshedUser = await getCurrentUser();
            setCurrentUser(refreshedUser);
            await AsyncStorage.setItem('@current_user', JSON.stringify(refreshedUser));

        } catch (error) {
            console.error('Failed to refresh current user', error);
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('@current_user');
                if (userData) {
                    const currentUser = JSON.parse(userData) as User;
                    setCurrentUser(currentUser);
                }
                else {
                    await refreshCurrentUser(); // Refresh user if not in AsyncStorage
                }
            } catch (error) {
                console.error('Failed to fetch current user', error);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, refreshCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
