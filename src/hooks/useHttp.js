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

    instance.interceptors.request.use(
        (config) => {
            config.headers.Authorization = `Bearer ${auth?.accessToken}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response.status === 401 && !error.config._retry) {
                console.log("Mark the request as retried")
                error.config._retry = true;
                try {
                    console.log("Attempt to refresh the token")
                    const refreshTokenResponse = await axios.post(`${BASE_URL}/v1/auth/refresh-token`, {
                        refreshToken: auth?.refreshToken,
                    });

                    if (refreshTokenResponse.status === 200) {
                        console.log("Update the access token")
                        auth.setAccessToken(refreshTokenResponse.data.accessToken);
                        console.log("Resend the original request with the new access token")
                        error.config.headers.Authorization = `Bearer ${refreshTokenResponse.data.accessToken}`;
                        return instance(error.config);
                    }
                } catch (refreshError) {
                    // Handle refresh token errors (e.g., navigate to login)
                    navigate('/login');
                    return Promise.reject(refreshError);
                }
            } else if (error.response.status === 403) {
                // Handle forbidden errors (e.g., navigate to login)
                navigate('/login');
            }
            // Propagate other errors
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useHttp;
