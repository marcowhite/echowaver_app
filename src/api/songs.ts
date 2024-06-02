import sendRequest from "../utils/request"
import { SongAdd } from "./schemas";

export const postSong = async (albumData: SongAdd, audio_file: any, image_file: any): Promise<any> => {
    return sendRequest(`song/`, 'POST', albumData);
};
export const getSongs = async (): Promise<any> => {
    return sendRequest('song', 'GET');
};
export const getSongById = async (songId: number): Promise<any> => {
    return sendRequest(`song/${songId}`, 'GET');
};

export const getSongsByUserId = async (userId: number): Promise<any> => {
    return sendRequest(`song/user/${userId}`, 'GET');
};

export const getSongTags = async (): Promise<any> => {
    return sendRequest('song/tag', 'GET');
};

export const assignTagToSong = async (songId: number, tagId: number): Promise<boolean> => {
    return sendRequest(`song/tag/${tagId}`, 'POST', { song_id: songId });
};

export const likeSong = async (songId: number): Promise<any> => {
    return sendRequest(`song/like/${songId}`, 'POST');
};

export const repostSong = async (songId: number): Promise<any> => {
    return sendRequest(`song/repost/${songId}`, 'POST');
};

export const getSongReposts = async (songId: number): Promise<any> => {
    return sendRequest(`song/reposts/${songId}`, 'GET');
};
