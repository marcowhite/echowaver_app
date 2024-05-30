interface CountryAdd{
    name: string,
    code: string,
}


interface Country extends CountryAdd{
    id: number,
}