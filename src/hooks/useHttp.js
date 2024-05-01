import axios from 'axios';
import { BASE_URL } from '../config/config';
import { useAuth } from './useAuth';
import {useNavigate} from "react-router-dom";

const useHttp = () => {
    const navigate = useNavigate()
    const auth = useAuth();
    const instance = axios.create({
        baseURL: BASE_URL,
    });

    // Request Interceptor
    instance.interceptors.request.use(
        (config) => {
            // Add the Authorization header if the accessToken exists
            if (auth.accessToken) {
                config.headers.Authorization = `Bearer ${auth.accessToken}`;
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
            return response;
        },
        async (error) => {
            if (error.response) {
                if (error.response.data.error === 'expired token' && (error.response.status === 401 || error.response.status === 403))  {
                  console.log("Token expired. navigating to login...");
                  navigate("/login");
                }
            } else if (error.request) {
                console.log("No response received. Please check your network connection.");
                navigate("/server-error")
            } else {
                console.error("Error setting up response handling:", error.message);
                return Promise.reject(error);
            }

        }
    );

    return instance;
};

export default useHttp;
