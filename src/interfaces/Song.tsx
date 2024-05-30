import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

interface SongAdd{
    name: string,
    description: string,
    genre: string,

    background: string,

    is_public: boolean
}


interface Song extends SongAdd{
    id: Int32,
    user_id: Int32,
    cover_file: string,
    audio_file: string,
} 

    
