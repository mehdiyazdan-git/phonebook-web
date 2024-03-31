import axios from 'axios';


import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../config/config";
import {useAuth} from "../components/hooks/useAuth";


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
        (error) => {
            if (error.response.status === 403) {
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useHttp;
