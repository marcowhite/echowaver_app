import sendRequest from "../utils/request"

export const uploadImageFile = async (imageData: FormData): Promise<any> => {
    return sendRequest('file/upload/image', 'POST', imageData);
};

export const uploadMusicFile = async (musicData: FormData): Promise<any> => {
    return sendRequest('file/upload/music', 'POST', musicData);
};
