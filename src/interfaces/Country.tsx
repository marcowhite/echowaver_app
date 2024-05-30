import { Int32 } from "react-native/Libraries/Types/CodegenTypes"

interface CountryAdd{
    name: string,
    code: string,
}


interface Country extends CountryAdd{
    id: Int32,
}