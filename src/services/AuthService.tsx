import CookieManager, { Cookie } from "@react-native-cookies/cookies";

export type AuthData = {
    token: string;
    email: string;
    cookie_name: string;
};

const signIn = async (email: string, _password: string): Promise<AuthData> => {
    var data = new URLSearchParams();
    data.append('username', email);
    data.append('password', _password);

    try {
        const response = await fetch(`http://10.0.2.2:8000/user/auth/jwt/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        });

        if (!response.ok) {
            throw new Error('Invalid username or password');
        }

        const headers = response.headers;
        const unparsedCookie = headers.get('set-cookie') || "";
        const myCookie = unparsedCookie.split(';')[0];
        const [parsedName, parsedValue] = myCookie.split('=');

        const cookie: Cookie = {
            name: parsedName,
            value: parsedValue,
        };

        await CookieManager.set('http://10.0.2.2:8000/', cookie);

        return {
            token: parsedValue,
            email: email,
            cookie_name: parsedName,
        };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const authService = {
    signIn,
};
