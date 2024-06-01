import sendRequest from "../utils/request"


export const getCountryById = async (countryId: number): Promise<any> => {
    return sendRequest(`country/${countryId}`, 'GET');
};

