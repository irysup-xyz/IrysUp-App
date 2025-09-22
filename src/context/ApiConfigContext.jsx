import React from "react";
import { createContext, useContext } from "react";

const ApiConfigContext = createContext();

export const ApiConfigProvider = ({ children, baseApiUrl }) => {
    return (
        <ApiConfigContext.Provider value={{ baseApiUrl }}>
            {children}
        </ApiConfigContext.Provider>
    );
};

export const useApiConfig = () => {
    const context = useContext(ApiConfigContext);
    if (!context) {
        throw new Error("useApiConfig must be used within ApiConfigProvider");
    }
    return context;
};