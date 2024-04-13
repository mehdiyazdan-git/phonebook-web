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

    // Request interceptor to add the authorization token to every request
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

    // Response interceptor to handle response errors
    instance.interceptors.response.use(
        response => response,  // If the response is successful, just return it
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 403) {
                // If the status code is 403, navigate to the login page immediately
                navigate('/login');
            } else if (error.response.status === 401 && !originalRequest._retry) {
                // If the status code is 401, attempt to refresh the token
                originalRequest._retry = true;  // Mark this request as already retried

                try {
                    const newAccessToken = await auth.refreshToken();  // Method to refresh token
                    if (newAccessToken) {
                        // If token refresh was successful, update the token in the request
                        auth.accessToken = newAccessToken;  // Update the accessToken in auth context
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return instance(originalRequest);  // Retry the original request with the new token
                    }
                } catch (refreshError) {
                    // If token refresh fails, navigate to the login page
                    navigate('/login');
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useHttp;
