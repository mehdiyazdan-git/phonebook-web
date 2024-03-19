import axios from 'axios';


import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../config/config";


const useHttp = () => {

    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: BASE_URL,
    });

    instance.interceptors.request.use(
        (config) => {
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
