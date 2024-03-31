import { createContext, useContext, useState } from 'react';

const IdleTimeoutContext = createContext();

export const IdleTimeoutProvider = ({ children }) => {
    const [timeout, setTimeout] = useState(1000 * 60 * 60); // Default 1 hour
    const [error] = useState(null); // State to store error message



    return (
        <IdleTimeoutContext.Provider value={{ timeout, setTimeout, error }}>
            {children}
        </IdleTimeoutContext.Provider>
    );
};

export const useIdleTimeout = () => useContext(IdleTimeoutContext);
