import { User } from "./schemas";
import sendRequest from "../utils/request"

// Подписка на пользователя по ID
export const followUserById = async (id: number): Promise<any> => {
    return sendRequest(`user/follow/${id}`, 'POST');
};

// Получение профиля пользователя по ID
export const getUserProfileById = async (id: number): Promise<any> => {
    return sendRequest(`user/profile/${id}`, 'GET');
};

// Получение подписчиков пользователя по ID
export const getUserFollowersById = async (id: number): Promise<any> => {
    return sendRequest(`user/followers/${id}`, 'GET');
};

// Получение подписок пользователя по ID
export const getUserFollowsById = async (id: number): Promise<any> => {
    return sendRequest(`user/follows/${id}`, 'GET');
};

export const unfollowUserById = async (id: number): Promise<any> => {
    return sendRequest(`user/unfollow/${id}`, 'POST');
};

export const getUserRoles = async (): Promise<any> => {
    return sendRequest('user/role', 'GET');
};

export const getFollowings = async (userId: number): Promise<any> => {
    return sendRequest(`user/follow/${userId}`, 'GET');
};

export const getCurrentUser = async (): Promise<any> => {
    return sendRequest('user/auth/me', 'GET');
};

export const getUserProfile = async (userId: number): Promise<any> => {
    return sendRequest(`user/profile/${userId}`, 'GET');
};

export const patchCurrentUser = async (userData: Partial<User>): Promise<any> => {
    return sendRequest('user/auth/me', 'PATCH', userData);
};
export const getUserById = async (userId: number): Promise<any> => {
    return sendRequest(`user/auth/${userId}`, 'GET');
};

export const patchUserById = async (userId: number, userData: Partial<User>): Promise<any> => {
    return sendRequest(`user/auth/${userId}`, 'PATCH', userData);
};

export const deleteUserById = async (userId: number): Promise<any> => {
    return sendRequest(`user/auth/${userId}`, 'DELETE');
};

export const getUserReposts = async (userId: number): Promise<any> => {
    return sendRequest(`user/reposts/${userId}`, 'GET');
};
export const getUserLikes = async (userId: number): Promise<any> => {
    return sendRequest(`user/likes/${userId}`, 'GET');
};