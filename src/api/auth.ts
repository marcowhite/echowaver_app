import { UserLogin, UserRegister } from "./schemas";

export const postUserRegister = async (userData: UserRegister): Promise<any> => {
    return sendRequest('user/auth/register', 'POST', {
        display_name: userData.name,
        email: userData.email,
        password: userData.password,
        is_active: true,
        is_superuser: false,
        is_verified: false,
    });
};

export const postUserLogin = async (userData: UserLogin): Promise<any> => {
    return sendRequest('user/auth/jwt/login', 'POST', userData);
};

export const postUserLogout = async (): Promise<any> => {
    return sendRequest('user/auth/jwt/logout', 'POST');
};