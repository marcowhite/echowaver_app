import { User } from "./schemas";
import sendRequest from "../utils/request"

export const getUserRoles = async (): Promise<any> => {
    return sendRequest('user/role', 'GET');
};

export const getFollowings = async (userId: number): Promise<any> => {
    return sendRequest(`user/follow/${userId}`, 'GET');
};

export const followUser = async (userId: number, targetUserId: number): Promise<boolean> => {
    return sendRequest(`user/followers/${targetUserId}`, 'POST', { follower_id: userId });
};

export const getUsers = async (): Promise<any> => {
    return sendRequest('user/auth/me', 'GET');
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