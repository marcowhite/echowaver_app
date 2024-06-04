import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Image, ActivityIndicator, Alert, Switch } from 'react-native';
import { Button, Card, Input, Text } from '@rneui/themed';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { updateUser, User, UserUpdate } from '../../../api';
import { useUser } from '../../../contexts/UserContext';
import { UploadFileItem } from 'react-native-fs';

type ProfileScreenNavigationProp = NavigationProp<any, 'Profile'>;

const sendFileToServer = async (file: UploadFileItem, endpoint: string) => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: file.filepath,
            name: file.filename,
            type: file.filetype,
        });

        const response = await fetch(`http://10.0.2.2:8000/file/upload/${endpoint}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
};

const UpdateProfile: React.FC = () => {
    const { currentUser, setCurrentUser, refreshCurrentUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<UploadFileItem | null>(null);
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    const handleFileSelect = async (setFile: React.Dispatch<React.SetStateAction<UploadFileItem | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
        try {
            setLoading(true);
            const result = await DocumentPicker.pickSingle({
                type: [types.images],
            });

            const fileUri = result.uri;
            const fileType = result.type;
            const fileName = result.name;

            if (fileUri && fileType && fileName) {
                const file: UploadFileItem = {
                    name: fileName,
                    filename: fileName,
                    filepath: fileUri,
                    filetype: fileType,
                };
                setFile(file);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
            } else {
                console.error('Error picking file:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);

            let avatarPath = currentUser.avatar;
            if (avatar) {
                const avatarResponse = await sendFileToServer(avatar, 'image');
                avatarPath = avatarResponse.message;
            }

            const updatedUser: UserUpdate = {
                email: currentUser.email,
                password: currentUser.password,
                display_name: currentUser.display_name,
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
                is_public: currentUser.is_public,
                city: currentUser.city,
                bio: currentUser.bio,
                url: currentUser.url,
                avatar: avatarPath,
                background: currentUser.background,
                spotlight: currentUser.spotlight,
            };

            await updateUser(updatedUser);
            await refreshCurrentUser();

            Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK' }]);
            navigation.navigate('Profile', { profile: currentUser });
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Card>
                <Card.Title h3={true}>Update Profile</Card.Title>
                <Card.Divider />
                <Input value={currentUser.display_name} onChangeText={(text) => setCurrentUser({ ...currentUser, display_name: text })} placeholder="Display Name" />
                <Input value={currentUser.first_name} onChangeText={(text) => setCurrentUser({ ...currentUser, first_name: text })} placeholder="First Name" />
                <Input value={currentUser.last_name} onChangeText={(text) => setCurrentUser({ ...currentUser, last_name: text })} placeholder="Last Name" />
                <Input value={currentUser.city} onChangeText={(text) => setCurrentUser({ ...currentUser, city: text })} placeholder="City" />
                <Input value={currentUser.bio} onChangeText={(text) => setCurrentUser({ ...currentUser, bio: text })} placeholder="Bio" />
                <Input value={currentUser.url} onChangeText={(text) => setCurrentUser({ ...currentUser, url: text })} placeholder="URL" />
                <View style={styles.container}>
                    <Switch value={currentUser.is_public} onValueChange={() => setCurrentUser({ ...currentUser, is_public: !currentUser.is_public })} />
                    <Text>Public Profile</Text>
                </View>
                <Text>{avatar ? 'Avatar selected' : 'No avatar selected'}</Text>
                <Button
                    title="Select Avatar"
                    onPress={() => handleFileSelect(setAvatar, setLoading)}
                />
                {loading && <ActivityIndicator size="small" color="#0000ff" />}
                <Card.Divider />
                <Button onPress={handleProfileUpdate} title="Update Profile" />
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingBottom: 100, // отступ для miniPlayer
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
});

export default UpdateProfile;
