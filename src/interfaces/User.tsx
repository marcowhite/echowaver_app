import { Int32 } from "react-native/Libraries/Types/CodegenTypes"

interface UserCreate{
    email: string,
    password: string,
    display_name: string,
}



interface User extends UserCreate{
    id: Int32,

    is_active: boolean,
    is_superuser: boolean,
    is_verified: boolean,
    is_public: boolean,

    first_name: string,
    last_name: string,

    role: Int32,

    city: string,
    bio: string,

    url: string,
    avatar: string,
    background: string,
    spotlight:string,
}
