import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../config/config'; // Ensure the BASE_URL is correctly imported

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('accessToken') || '');
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken') || '');
    const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem('currentUser') || '');
    const [role, setRole] = useState(() => sessionStorage.getItem('role') || '');
    const navigate = useNavigate();

    const cleanCredentials = () => {
        setAccessToken('');
        setRefreshToken('');
        setCurrentUser('');
        setRole('');
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('role');
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/v1/auth/authenticate`, {
                username,
                password
            });

            if (response.status === 200) {
                setAccessToken(response.data.access_token);
                setCurrentUser(response.data.userName);
                setRefreshToken(response.data.refresh_token);
                setRole(response.data.role);
                sessionStorage.setItem('accessToken', response.data.access_token);
                localStorage.setItem('refreshToken', response.data.refresh_token);
                sessionStorage.setItem('currentUser', response.data.userName);
                sessionStorage.setItem('role', response.data.role);
                return true; // Return true to indicate successful login
            }
        } catch (error) {
            console.error('Authentication error:', error);
            return error.response || { status: 500, message: 'Internal Server Error' }; // Return error response
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (response.status === 204) {
                cleanCredentials();
                navigate('/login');
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    // implement refresh token logic here
    const restoreAccessToken = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/v1/auth/refresh-token`, {}, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            });
            if (response.status === 200) {
                setAccessToken(response.data.access_token);
                sessionStorage.setItem('accessToken', response.data.access_token);
                setRefreshToken(response.data.refresh_token)
                localStorage.setItem('refreshToken', response.data.refresh_token);
                setCurrentUser(response.data.userName)
                sessionStorage.setItem('currentUser', response.data.userName);
                setRole(response.data.role)
                sessionStorage.setItem('role', response.data.role);
            }
        } catch (error) {
            console.error("Error during token refresh:", error);
        }

    };

    useEffect(() => {
        sessionStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('currentUser', currentUser);
        sessionStorage.setItem('role', role);
    }, [accessToken, refreshToken, currentUser, role]);

    const value = {
        accessToken,
        refreshToken,
        currentUser,
        role,
        cleanCredentials,
        restoreAccessToken,
        login,
        logout,
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
