const baseUrl = 'http://10.0.2.2:8000';
import { useState } from 'react';

interface User {
  id: number;
  // Добавьте остальные поля из вашего интерфейса User
}

interface UserRegister {
  name: string;
  email: string;
  password: string;
}

interface UserLogin {
  username: string;
  password: string;
}

export const useAPI = () => {
  const [error, setError] = useState<string | null>(null);

  const postUserRegister = async (user: UserRegister): Promise<User | null> => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/user/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          display_name: user.name, 
          email: user.email, 
          password: user.password,
          is_active: true,
          is_superuser: false,
          is_verified: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const userData: User = await response.json();
      return userData;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const postUserLogin = async (user: UserLogin): Promise<string | null> => {
    try {
      const data = new URLSearchParams();
      data.append('username', user.username);
      data.append('password', user.password);

      const response = await fetch(`http://10.0.2.2:8000/user/auth/jwt/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString(),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const headers = new Map(response.headers);
      const unparsedCookie = headers.get('set-cookie') || '';
      const myCookie = unparsedCookie.split(';')[0];
      const [, parsedValue] = myCookie.split('=');

      return parsedValue;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  return { postUserRegister, postUserLogin, error };
};
const sendRequest = async (path: string, method: string, data?: any): Promise<any> => {
  try {
    const requestOptions: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(`${baseUrl}/${path}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to ${method} ${path}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Функции для выполнения конкретных запросов

const createAlbumForUser = async (userId: number, albumData: AlbumCreateRequest): Promise<any> => {
  return sendRequest(`album/user/${userId}`, 'POST', albumData);
};

const getAlbumTypes = async (): Promise<any> => {
  return sendRequest('album/type', 'GET');
};

const getAlbumTypeById = async (typeId: number): Promise<any> => {
  return sendRequest(`album/type/${typeId}`, 'GET');
};

const createCountry = async (countryData: CountryCreateRequest): Promise<any> => {
  return sendRequest('country', 'POST', countryData);
};

const getCountryById = async (countryId: number): Promise<any> => {
  return sendRequest(`country/${countryId}`, 'GET');
};

const getSongTags = async (): Promise<any> => {
  return sendRequest('song/tag', 'GET');
};

const assignTagToSong = async (songId: number, tagId: number): Promise<boolean> => {
  return sendRequest(`song/tag/${tagId}`, 'POST', { song_id: songId });
};

const getUserRoles = async (): Promise<any> => {
  return sendRequest('user/role', 'GET');
};

const getFollowings = async (userId: number): Promise<any> => {
  return sendRequest(`user/follow/${userId}`, 'GET');
};

const followUser = async (userId: number, targetUserId: number): Promise<boolean> => {
  return sendRequest(`user/followers/${targetUserId}`, 'POST', { follower_id: userId });
};

const postUserLogin = async (userData: UserLogin): Promise<any> => {
    return sendRequest('user/auth/jwt/login', 'POST', userData);
  };
  
  const postUserLogout = async (): Promise<any> => {
    return sendRequest('user/auth/jwt/logout', 'POST');
  };
  
  const uploadImageFile = async (imageData: FormData): Promise<any> => {
    return sendRequest('file/upload/image', 'POST', imageData);
  };
  
  const uploadMusicFile = async (musicData: FormData): Promise<any> => {
    return sendRequest('file/upload/music', 'POST', musicData);
  };
  
  const likeSong = async (songId: number): Promise<any> => {
    return sendRequest(`song/like/${songId}`, 'POST');
  };
  
  const likeAlbum = async (albumId: number): Promise<any> => {
    return sendRequest(`album/like/${albumId}`, 'POST');
  };
  
  const getUserLikes = async (userId: number): Promise<any> => {
    return sendRequest(`user/likes/${userId}`, 'GET');
  };
  
  const repostSong = async (songId: number): Promise<any> => {
    return sendRequest(`song/repost/${songId}`, 'POST');
  };
  
  const repostAlbum = async (albumId: number): Promise<any> => {
    return sendRequest(`album/repost/${albumId}`, 'POST');
  };
  
  const getSongReposts = async (songId: number): Promise<any> => {
    return sendRequest(`song/reposts/${songId}`, 'GET');
  };
  
  const getAlbumReposts = async (albumId: number): Promise<any> => {
    return sendRequest(`album/reposts/${albumId}`, 'GET');
  };
  
  const getUserReposts = async (userId: number): Promise<any> => {
    return sendRequest(`user/reposts/${userId}`, 'GET');
  };
  
  // Включение других эндпоинтов
  
  const api = {
    createAlbumForUser,
    getAlbumTypes,
    getAlbumTypeById,
    createCountry,
    getCountryById,
    getSongTags,
    assignTagToSong,
    getUserRoles,
    getFollowings,
    followUser,
    postUserLogin,
    postUserLogout,
    uploadImageFile,
    uploadMusicFile,
    likeSong,
    likeAlbum,
    getUserLikes,
    repostSong,
    repostAlbum,
    getSongReposts,
    getAlbumReposts,
    getUserReposts,
  };
  
  export default api;