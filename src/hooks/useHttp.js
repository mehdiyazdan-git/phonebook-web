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
            if (!error.response) {
                // No response received from the server
                navigate('/login');
            }

            // Handle 401 Unauthorized
            if (error.response.status === 401 && !error.config._retry) {
                error.config._retry = true;
                try {
                    const refreshTokenResponse = await axios.post(`${BASE_URL}/v1/auth/refresh-token`, {
                        refreshToken: auth?.refreshToken,
                    });

                    if (refreshTokenResponse.status === 200) {
                        auth.setAccessToken(refreshTokenResponse.data.accessToken);
                        error.config.headers.Authorization = `Bearer ${refreshTokenResponse.data.accessToken}`;
                        return instance(error.config);
                    }
                } catch (refreshError) {
                    navigate('/login');
                    return Promise.reject(refreshError);
                }
            }

            // Handle 403 Forbidden or other errors
            if (error.response.status === 403 || error.response.status >= 500) {
                navigate('/login');
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export default useHttp;
