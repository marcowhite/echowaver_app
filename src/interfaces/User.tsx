interface UserCreate{
    email: string,
    password: string,
    display_name: string,
}



interface User extends UserCreate{
    id: number,

    is_active: boolean,
    is_superuser: boolean,
    is_verified: boolean,
    is_public: boolean,

    first_name: string,
    last_name: string,

    role: number,

    city: string,
    bio: string,

    url: string,
    avatar: string,
    background: string,
    spotlight:string,
}
