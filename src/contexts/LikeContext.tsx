import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserLikes, likeSong, unlikeSong, Song } from '../api';
import { useUser } from './UserContext';
import { track } from '@amplitude/analytics-react-native';

type LikeContextType = {
    likedSongs: Set<number>;
    toggleLike: (songId: number) => Promise<void>;
    isLiked: (songId: number) => boolean;
};

type LikeProviderProps = {
    children: ReactNode;
};

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<LikeProviderProps> = ({ children }) => {
    const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
    const { currentUser } = useUser();

    useEffect(() => {
        const fetchLikes = async () => {
            if (currentUser) {
                try {
                    const userLikes = await getUserLikes(currentUser.id);
                    const likedIds = userLikes.song_like.map(like => like.liked_id);
                    setLikedSongs(new Set(likedIds));
                } catch (error) {
                    console.error('Failed to fetch user likes', error);
                }
            }
        };

        fetchLikes();
    }, [currentUser]);

    const toggleLike = async (songId: number) => {
        if (!currentUser) return;

        try {
            if (likedSongs.has(songId)) {
                await unlikeSong(songId);
                setLikedSongs(prev => new Set([...prev].filter(id => id !== songId)));
                track('Unlike Song', { songId });
            } else {
                await likeSong(songId);
                setLikedSongs(prev => new Set(prev).add(songId));
                track('Like Song', { songId });
            }
        } catch (error) {
            console.error('Failed to toggle like', error);
        }
    };

    const isLiked = (songId: number) => likedSongs.has(songId);

    return (
        <LikeContext.Provider value={{ likedSongs, toggleLike, isLiked }}>
            {children}
        </LikeContext.Provider>
    );
};

export const useLike = (): LikeContextType => {
    const context = useContext(LikeContext);
    if (!context) {
        throw new Error('useLike must be used within a LikeProvider');
    }
    return context;
};
