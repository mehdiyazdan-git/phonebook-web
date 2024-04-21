import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/config';
import { useAuth } from './useAuth';

const useHttp = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const instance = axios.create({
        baseURL: BASE_URL,
    });

    // Request Interceptor
    instance.interceptors.request.use(
        (config) => {
            // Add the Authorization header if the accessToken exists
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        }, (error) => {
            // Handle errors before the request is sent
            console.error("Error in request setup:", error);
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    instance.interceptors.response.use(
        (response) => {
            // Handle responses
            return response;
        },
        (error) => {
            // Handle errors in response
            if (error.response) {
                // Handle 403 Forbidden error specifically
                if (error.response.status === 403) {
                    console.error("Access denied. Redirecting to login.");
                    navigate('/login');
                } else {
                    console.error("Server responded with an error:", error.response.status);
                }
            } else if (error.request) {
                // Handle case where no response was received
                console.log("No response received. Please check your network connection.");
            } else {
                // Handle other errors
                console.error("Error setting up response handling:", error.message);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useHttp;
