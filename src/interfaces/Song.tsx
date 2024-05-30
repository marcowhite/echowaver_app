interface SongAdd{
    name: string,
    description: string,
    genre: string,

    background: string,

    is_public: boolean
}


interface Song extends SongAdd{
    id: number,
    user_id: number,
    cover_file: string,
    audio_file: string,
} 

    
