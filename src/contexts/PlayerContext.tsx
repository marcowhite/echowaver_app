import React, { createContext, useState, useEffect, useRef, useContext, ReactNode } from 'react';
import Sound from 'react-native-sound';
import {Song} from "../api"


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
    setCurrentDuration: (value: number) => void; // Добавлено
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
    const playbackInstanceRef = useRef<Sound | null>(null);

    const updateTracks = (updatedTracks: Song[]) => {
        setTracks(updatedTracks);
    };

    const updateCurrentTrack = (updatedTrack: Song | null) => {
        setCurrentTrack(updatedTrack);
    };

    const updateCurrentDuration = (value: number) => {
        setCurrentDuration(value);
    };

    useEffect(() => {
        if (currentTrack) {
            const fetchAudio = async () => {
                try {
                    const response = await fetch(`http://10.0.2.2:8000/file/audio/${currentTrack.audio_file}`);
                    const audioUrl = response.url;
                    const newSound = new Sound(audioUrl, '', (error) => {
                        if (error) {
                            console.log('Failed to load the sound', error);
                            return;
                        }
                        setTotalDuration(newSound.getDuration());
                        setSound(newSound);
                        playbackInstanceRef.current = newSound;
                    });
                } catch (error) {
                    console.error('Failed to fetch audio', error);
                }
            };

            fetchAudio();

            return () => {
                sound?.release();
            };
        }
    }, [currentTrack]);

    const playPause = () => {
        if (!sound) return;

        if (isPlaying) {
            sound.pause();
        } else {
            sound.play(() => {
                setIsPlaying(false);
                setCurrentDuration(0); // Reset duration when playback finishes
            });
        }
        setIsPlaying(!isPlaying);
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
            setCurrentDuration: updateCurrentDuration, // Добавлено
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
