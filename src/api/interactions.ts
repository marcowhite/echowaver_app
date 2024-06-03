import sendRequest from "../utils/request";
// Лайк песни
export const likeSong = async (id: number): Promise<any> => {
    return sendRequest(`song/like/${id}`, 'POST');
};

// Удаление лайка с песни
export const unlikeSong = async (id: number): Promise<any> => {
    return sendRequest(`song/like/${id}`, 'DELETE');
};

// Лайк альбома
export const likeAlbum = async (id: number): Promise<any> => {
    return sendRequest(`album/like/${id}`, 'POST');
};

// Удаление лайка с альбома
export const unlikeAlbum = async (id: number): Promise<any> => {
    return sendRequest(`album/like/${id}`, 'DELETE');
};

// Репост песни
export const repostSong = async (id: number, repostedId: number): Promise<any> => {
    return sendRequest(`song/repost/${id}?reposted_id=${repostedId}`, 'POST');
};

// Отмена репоста песни
export const unrepostSong = async (id: number, repostedId: number): Promise<any> => {
    return sendRequest(`song/repost/${id}?reposted_id=${repostedId}`, 'DELETE');
};

// Репост альбома
export const repostAlbum = async (id: number, repostedId: number): Promise<any> => {
    return sendRequest(`album/repost/${id}?reposted_id=${repostedId}`, 'POST');
};

// Отмена репоста альбома
export const unrepostAlbum = async (id: number, repostedId: number): Promise<any> => {
    return sendRequest(`album/repost/${id}?reposted_id=${repostedId}`, 'DELETE');
};

// Получение лайков песни по ID
export const getSongLikesById = async (id: number): Promise<any> => {
    return sendRequest(`song/likes/${id}`, 'GET');
};


// Получение репостов песни по ID
export const getSongRepostsById = async (id: number): Promise<any> => {
    return sendRequest(`song/reposts/${id}`, 'GET');
};

// Получение репостов альбома по ID
export const getAlbumRepostsById = async (id: number): Promise<any> => {
    return sendRequest(`album/reposts/${id}`, 'GET');
};

// Получение репостов пользователя по ID
export const getUserReposts = async (id: number): Promise<any> => {
    return sendRequest(`user/reposts/${id}`, 'GET');
};

// Получение лайков пользователя по ID
export const getUserLikes = async (id: number): Promise<any> => {
    return sendRequest(`user/likes/${id}`, 'GET');
};

