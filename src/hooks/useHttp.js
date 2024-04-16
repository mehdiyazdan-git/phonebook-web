import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/config';
import { useAuth } from '../components/hooks/useAuth';

const useHttp = () => {
    const { accessToken, refreshToken, setAccessToken, setRefreshToken } = useAuth();
    const navigate = useNavigate();
    const instance = axios.create({
        baseURL: BASE_URL,
    });
    // Attach the token to every request if available
    instance.interceptors.request.use(
        (config) => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Handle response errors globally
    instance.interceptors.response.use(
        response => response,
        async (error) => {
            //handle network error
            if (!error.request) {
                navigate("/login")
                return;
            }
            const originalRequest = error.config;
            if (!error.response || error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const response = await instance.get('/auth/refresh', {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    })
                    if (response.data.accessToken === 200) {
                        const newAccessToken = response.data.accessToken;
                        if (newAccessToken) {
                            setAccessToken(newAccessToken);
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            return instance(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    // check network error.
                    if (error.request){
                        navigate("/login");
                        return;
                    }
                    //check invalid refresh token
                    if (error.response && error.response.status === 401){
                        navigate("/login");
                        return;
                    }
                }
            }
            return Promise.reject(error);
        }
    );
    return instance;
};

export default useHttp;
