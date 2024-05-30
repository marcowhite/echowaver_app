interface AlbumAdd{
    name: string,
    description: string,
    is_public: boolean,
    album_type_id: number,
    song_order: string,
}


interface Album extends AlbumAdd{
    user_id: number,
    id: number,
}
