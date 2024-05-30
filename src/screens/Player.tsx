import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Slider,
} from 'react-native';
import { Audio } from 'expo-av';
import { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

interface Track {
  title: string;
  artist: string;
  cover: string; // URL of the cover image
  audioUrl: string; // URL of the audio file
}

const Player: React.FC<{ track: Track }> = ({ track }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);
  const playbackInstanceRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Load the audio when the track changes
    const loadAudio = async () => {
      const { sound } = await Audio.Sound.createAsync({ uri: track.audioUrl });
      setSound(sound);
      playbackInstanceRef.current = sound;
    };
    loadAudio();

    // Cleanup when the component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [track.audioUrl]);

  useEffect(() => {
    // Update the playback status when it changes
    if (sound) {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        setCurrentDuration(status.positionMillis / 1000);
        setTotalDuration(status.durationMillis / 1000);
        setIsPlaying(status.isPlaying);
      });
    }
  }, [sound]);

  const playPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const rewind = async () => {
    setIsRewinding(true);
    if (!sound) return;
    await sound.setPositionAsync(currentDuration - 10); // Rewind by 10 seconds
    setIsRewinding(false);
  };

  const skipForward = async () => {
    if (!sound) return;
    await sound.setPositionAsync(currentDuration + 10); // Skip forward by 10 seconds
  };

  const stop = async () => {
    if (!sound) return;
    await sound.stopAsync();
    setIsPlaying(false);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (sound) {
      sound.setIsLoopingEnabled(!isLooping);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (sound) {
      sound.setVolumeAsync(value);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: track.cover }} style={styles.coverImage} />

      <View style={styles.playerControls}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <Text style={styles.trackArtist}>{track.artist}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={rewind} disabled={isRewinding}>
            <Text style={styles.controlButton}>
              {/* Icon for rewind */}
              ⏪
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={playPause}>
            <Text style={styles.controlButton}>
              {/* Icon for play/pause */}
              {isPlaying ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={skipForward}>
            <Text style={styles.controlButton}>
              {/* Icon for skip forward */}
              ⏩
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={stop}>
            <Text style={styles.controlButton}>
              {/* Icon for stop */}
              ⏹
            </Text>
          </TouchableOpacity>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={totalDuration}
          value={currentDuration}
          onValueChange={(value: Float) => {
            if (sound) {
              sound.setPositionAsync(value * 1000);
            }
            setCurrentDuration(value);
          }}
        />

        <View style={styles.duration}>
          <Text style={styles.durationText}>
            {formatTime(currentDuration)} / {formatTime(totalDuration)}
          </Text>
        </View>

        <View style={styles.loopControl}>
          <TouchableOpacity onPress={toggleLoop}>
            <Text style={styles.controlButton}>
              {/* Icon for loop */}
              {isLooping ? '🔁' : '🔂'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.volumeControl}>
          <Text style={styles.volumeLabel}>Volume</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
          />
        </View>
      </View>
    </View>
  );
};

// Helper function to format time in minutes and seconds
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  playerControls: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trackInfo: {
    marginBottom: 10,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 15,
  },
  controlButton: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
  },
  slider: {
    width: '80%',
  },
  duration: {
    marginBottom: 10,
  },
  durationText: {
    fontSize: 12,
  },
  loopControl: {
    marginBottom: 10,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  volumeLabel: {
    marginRight: 10,
  },
});

export default Player;