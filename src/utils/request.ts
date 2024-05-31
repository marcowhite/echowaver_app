const baseUrl = 'http://10.0.2.2:8000';

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
        throw error;
    }
};
