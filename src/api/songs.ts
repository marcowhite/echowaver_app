import sendRequest from "../utils/request"

export const getSongs = async (): Promise<any> => {
    return sendRequest('song', 'GET');
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
