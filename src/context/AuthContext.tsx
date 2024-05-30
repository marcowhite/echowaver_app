import React, {createContext} from "react";
import Provide

const AuthContext = createContext('auth');


export const AuthProvider = ({children: ProviderProps<string>}) => {
    return(
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    );
}


