import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('accessToken') || '');
    const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem('currentUser') || '');
    const [role, setRole] = useState(() => sessionStorage.getItem('role') || '');

    useEffect(() => {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('currentUser', currentUser);
        sessionStorage.setItem('role', role);
    }, [accessToken, currentUser]);

    const value = {
        accessToken,
        setAccessToken,
        currentUser,
        setCurrentUser,
        role,
        setRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
