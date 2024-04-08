import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/config';
import { useAuth } from '../components/hooks/useAuth';

const useHttp = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: BASE_URL,
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            if (auth?.accessToken) {
                config.headers.Authorization = `Bearer ${auth.accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const response = await axios.post('/auth/refresh', {
                        refreshToken: auth.refreshToken,
                    });

                    const { accessToken } = response.data;

                    auth.setAccessToken(accessToken);

                    return instance(originalRequest);

                } catch (error) {
                    // Handle refresh token error
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useHttp;
