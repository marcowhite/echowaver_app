import React from 'react';
import { Card } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import FollowCardItem from './FollowCardItem';
import { UserProfile } from '../api';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../screens/app/feed/Feed';

interface FollowsCardProps {
    follows: UserProfile[];
    navigation: NavigationProp<RootStackParamList>;
}

const FollowsCard: React.FC<FollowsCardProps> = ({ follows, navigation }) => {
    return (
        <Card>
            <Card.Title h3={true}>Following</Card.Title>
            <Card.Divider />
            <View style={styles.userContainer}>
                {follows.map(follow => (
                    <FollowCardItem
                        key={String(follow.id)}
                        follow={follow}
                        navigation={navigation}
                    />
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});

export default FollowsCard;
