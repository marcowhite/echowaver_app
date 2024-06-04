import React from 'react';
import { Card } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import AlbumCardItem from './AlbumCardItem';
import { Album } from '../api';

interface AlbumsCardProps {
    albums: Album[];
}

const AlbumsCard: React.FC<AlbumsCardProps> = ({ albums }) => {
    return (
        <Card>
            <Card.Title h3={true}>Albums</Card.Title>
            <Card.Divider />
            <View style={styles.albumContainer}>
                {albums.map(album => (
                    <AlbumCardItem
                        key={String(album.id)}
                        album={album}
                        onPress={() => {
                            // Handle album click if needed
                        }}
                    />
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    albumContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});

export default AlbumsCard;
