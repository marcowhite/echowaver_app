export interface AlbumAdd {
    name: string;
    description: string;
    is_public: boolean;
    album_type_id: number;
    song_order: string;
    cover_file: string;
}

export interface Album extends AlbumAdd {
    user_id: number;
    id: number;
}

export interface CountryAdd {
    name: string;
    code: string;
}

export interface Country extends CountryAdd {
    id: number;
}

export interface SongAdd {
    name: string;
    description: string;
    genre: string;
    background: string;
    is_public: boolean;
}

export interface Song extends SongAdd {
    id: number;
    user_id: number;
    cover_file: string;
    audio_file: string;
}

export interface UserProfile {
    id: number;

    display_name: string;
    first_name: string;
    last_name: string;
    is_public: boolean;

    city: string;
    bio: string;

    url: string;
    avatar: string;
    background: string;
    spotlight: string;
}

export interface UserRegister {
    name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface UserCreate {
    email: string;
    password: string;
    display_name: string;
}

export interface User extends UserCreate {
    id: number;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    is_public: boolean;
    first_name: string;
    last_name: string;
    role: number;
    city: string;
    bio: string;
    url: string;
    avatar: string;
    background: string;
    spotlight: string;
}