import React, { createContext, useState, useEffect, useRef, useContext, ReactNode } from 'react';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { Song, User, getUserLikes, likeSong, unlikeSong } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PlayerContextType = {
    tracks: Song[];
    currentTrack: Song | null;
    isPlaying: boolean;
    currentDuration: number;
    totalDuration: number;
    volume: number;
    playTrack: (track: Song) => void;
    playPause: () => void;
    stop: () => void;
    setVolume: (value: number) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setTracks: (tracks: Song[]) => void;
    setCurrentTrack: (track: Song) => void;
    setCurrentDuration: (value: number) => void;
    isLoading: boolean;
    isLiked: boolean;
    toggleLike: () => void;
};

type PlayerProviderProps = {
    children: ReactNode;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
    const [tracks, setTracks] = useState<Song[]>([]);
    const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
    const [sound, setSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const playbackInstanceRef = useRef<Sound | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('@current_user');
                if (userData) {
                    const user: User = JSON.parse(userData);
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Failed to fetch current user', error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchLikes = async () => {
            if (currentTrack && currentUser) {
                try {
                    const userLikes = await getUserLikes(currentUser.id);
                    const liked = userLikes.song_like.some((like) => like.liked_id === currentTrack.id);
                    setIsLiked(liked);
                } catch (error) {
                    console.error('Failed to fetch user likes', error);
                }
            }
        };

        fetchLikes();
    }, [currentTrack, currentUser]);

    const toggleLike = async () => {
        if (!currentTrack || !currentUser) return;

        setIsLoading(true);
        try {
            if (isLiked) {
                await unlikeSong(currentTrack.id);
            } else {
                await likeSong(currentTrack.id);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Failed to toggle like', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateTracks = (updatedTracks: Song[]) => {
        setTracks(updatedTracks);
    };

    const updateCurrentTrack = (updatedTrack: Song | null) => {
        setCurrentTrack(updatedTrack);
    };

    const updateCurrentDuration = (value: number) => {
        setCurrentDuration(value);
        if (sound) {
            sound.setCurrentTime(value);
        }
    };

    useEffect(() => {
        const fetchAudio = async () => {
            if (currentTrack) {
                setIsLoading(true);
                try {
                    const filePath = `${RNFS.DocumentDirectoryPath}/${currentTrack.audio_file}`;
                    const fileExists = await RNFS.exists(filePath);
                    if (!fileExists) {
                        console.log('Audio file not found in local storage, fetching from network');
                        const response = await fetch(`http://10.0.2.2:8000/file/audio/${currentTrack.audio_file}`);
                        const audioData = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            const base64data = reader.result as string;
                            await RNFS.writeFile(filePath, base64data.split(',')[1], 'base64');
                            console.log('Audio file saved locally');
                            loadSound(filePath);
                        };
                        reader.readAsDataURL(audioData);
                    } else {
                        console.log('Audio file found in local storage');
                        loadSound(filePath);
                    }
                } catch (error) {
                    console.error('Failed to fetch audio', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        const loadSound = (path: string) => {
            const newSound = new Sound(path, '', (error) => {
                if (error) {
                    console.log('Failed to load the sound', error);
                    return;
                }
                setTotalDuration(newSound.getDuration());
                setSound(newSound);
                playbackInstanceRef.current = newSound;
            });
        };

        fetchAudio();

        return () => {
            sound?.release();
        };
    }, [currentTrack]);

    const playPause = () => {
        if (!sound) return;

        if (isPlaying) {
            sound.pause(() => {
                setIsPlaying(false);
            });
        } else {
            sound.play(() => {
                setIsPlaying(false);
                setCurrentDuration(0);
            });
            setIsPlaying(true);
        }
    };

    const stop = () => {
        if (!sound) return;
        sound.stop(() => {
            setIsPlaying(false);
            setCurrentDuration(0);
        });
    };

    const handleVolumeChange = (value: number) => {
        setVolume(value);
        if (sound) {
            sound.setVolume(value);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (sound && isPlaying) {
                sound.getCurrentTime((seconds) => {
                    setCurrentDuration(seconds);
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, sound]);

    const playTrack = (track: Song) => {
        if (currentTrack?.id !== track.id) {
            stop();
            setCurrentTrack(track);
            setIsPlaying(false);
        } else {
            playPause();
        }
    };

    const nextTrack = () => {
        if (!tracks.length || !currentTrack) return;
        const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % tracks.length;
        stop();
        setCurrentDuration(0);
        setTotalDuration(0);
        playTrack(tracks[nextIndex]);
    };

    const prevTrack = () => {
        if (!tracks.length || !currentTrack) return;
        const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        stop();
        setCurrentDuration(0);
        setTotalDuration(0);
        playTrack(tracks[prevIndex]);
    };

    return (
        <PlayerContext.Provider value={{
            tracks,
            currentTrack,
            isPlaying,
            currentDuration,
            totalDuration,
            volume,
            playTrack,
            playPause,
            stop,
            setVolume: handleVolumeChange,
            nextTrack,
            prevTrack,
            setTracks: updateTracks,
            setCurrentTrack: updateCurrentTrack,
            setCurrentDuration: updateCurrentDuration,
            isLoading,
            isLiked,
            toggleLike,
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
