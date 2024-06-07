import React from 'react';
import { Card, Button } from '@rneui/themed';
import SongListItem from './SongListItem';
import { Song } from '../api';
import { usePlayer } from '../contexts/PlayerContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../screens/app/feed/Feed';
import { Text } from '@rneui/base';
import { StyleSheet, View } from 'react-native';

interface SongsCardProps {
    songs: Song[];
}

const SongsCard: React.FC<SongsCardProps> = ({ songs }) => {
    const { setTracks, setCurrentTrack } = usePlayer();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [showAll, setShowAll] = React.useState(false);

    const handleShowAll = () => {
        setShowAll(true);
    };

    const handleCollapse = () => {
        setShowAll(false);
    };

    const displayedSongs = showAll ? songs : songs.slice(0, 3);

    return (
        <Card>
            <Card.Title h3={true}>Songs</Card.Title>
            <Card.Divider />
            {songs.length === 0 && (
                <View style={styles.text}>
                    <Text h4={true} >Nothing here yet.</Text>
                </View>
            )}
            {displayedSongs.map(song => (
                <SongListItem
                    key={String(song.id)}
                    song={song}
                    onPress={() => {
                        setTracks(songs);
                        setCurrentTrack(song);
                        navigation.navigate('Player');
                    }}
                />
            ))}
            {!showAll && songs.length > 3 && (
                <Button
                    title="Show All"
                    type="clear"
                    onPress={handleShowAll}
                    titleStyle={{ color: '#007bff' }}
                />
            )}
            {showAll && (
                <Button
                    title="Hide"
                    type="clear"
                    onPress={handleCollapse}
                    titleStyle={{ color: '#007bff' }}
                />
            )}
        </Card>
    );
};

const styles = StyleSheet.create({ text: { justifyContent: "center", alignItems: 'center' } })

export default SongsCard;
