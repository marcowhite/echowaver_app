import { AlbumAdd } from "./schemas";
import sendRequest from "../utils/request"

export const createAlbumForUser = async (userId: number, albumData: AlbumAdd): Promise<any> => {
    return sendRequest(`album/user/${userId}`, 'POST', albumData);
};

export const getAlbumTypes = async (): Promise<any> => {
    return sendRequest('album/type', 'GET');
};

export const getAlbumTypeById = async (typeId: number): Promise<any> => {
    return sendRequest(`album/type/${typeId}`, 'GET');
};
export const likeAlbum = async (albumId: number): Promise<any> => {
    return sendRequest(`album/like/${albumId}`, 'POST');
};

export const repostAlbum = async (albumId: number): Promise<any> => {
    return sendRequest(`album/repost/${albumId}`, 'POST');
};

export const getAlbumReposts = async (albumId: number): Promise<any> => {
    return sendRequest(`album/reposts/${albumId}`, 'GET');
};

export const addAlbum = async (albumData: AlbumAdd): Promise<any> => {
    return sendRequest('album', 'POST', albumData);
};

export const getAlbums = async (): Promise<any> => {
    return sendRequest('album', 'GET');
};

export const getAlbumById = async (albumId: number): Promise<any> => {
    return sendRequest(`album/${albumId}`, 'GET');
};

export const deleteAlbumById = async (albumId: number): Promise<any> => {
    return sendRequest(`album/${albumId}`, 'DELETE');
};

export const getAlbumsByUserId = async (userId: number): Promise<any> => {
    return sendRequest(`album/user/${userId}`, 'GET');
};

export const addAlbumType = async (albumTypeData: { name: string }): Promise<any> => {
    return sendRequest('album/type', 'POST', albumTypeData);
};