import axios from 'axios';
import { BASE_URL } from '../config/config';
import { useAuth } from './useAuth';

const useHttp = () => {
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
            // Handle responses
            return response;
        },
        async (error) => {
            if (error.response) {
                if (error.response.status === 403 && error.response.data === "token expired") {
                 await auth.restoreAccessToken().then(() => {
                      // Retry the request
                      error.config.headers.Authorization = `Bearer ${auth.accessToken}`;
                      return axios.request(error.config);
                  }).catch((refreshError) => {
                      if (refreshError.response && refreshError.response.status === 401){
                          // Unauthorized, logout
                          console.error("Unauthorized.refresh token also expired, Please log in again.");
                          auth.logout();
                      }
                    });
                }
                console.error("Unauthorized. Please log in again.");
                await auth.logout();
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
