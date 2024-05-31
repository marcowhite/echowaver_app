export const getCountryById = async (countryId: number): Promise<any> => {
    return sendRequest(`country/${countryId}`, 'GET');
};

