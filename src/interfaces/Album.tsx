import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

interface AlbumAdd{
    name: string,
    description: string,
    is_public: boolean,
    album_type_id: Int32,
    song_order: string,
}


interface Album extends AlbumAdd{
    user_id: Int32,
    id: Int32,
}
