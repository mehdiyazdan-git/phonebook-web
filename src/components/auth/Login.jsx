import React from 'react';
import './Login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BASE_URL } from "../../config/config";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = React.useState('');
    const auth = useAuth();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/v1/auth/authenticate`, {
                username: data.username, // Changed from email to username
                password: data.password
            });

            if (response.status === 200) {
                auth.setAccessToken(response.data.access_token);
                auth.setCurrentUser(response.data.userName); // Changed from email to username
                auth.setRole(response.data.role);
                navigate(from);
                console.log('Authentication successful:', response.data);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                switch (error.response.status) {
                    case 401: // Unauthorized
                        setErrorMessage('Incorrect username or password');
                        break;
                    default:
                        setErrorMessage('An error occurred, please try again later');
                        break;
                }
            } else if (error.request) {
                // The request was made but no response was received
                setErrorMessage('Server connection error, please try again later');
            } else {
                // Something happened in setting up the request that triggered an Error
                setErrorMessage('An error occurred, please try again later');
            }
            console.error('Authentication error:', error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="login-title">Login</h2>
                <input
                    placeholder="Username"
                    {...register('username', { required: true })} // Changed from email to username
                />
                {errors.username && <p className="error-message">Username is required</p>}
                <input
                    type="password"
                    placeholder="Password"
                    {...register('password', { required: true })}
                />
                {errors.password && <p className="error-message">Password is required</p>}
                <button type="submit">Log in</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;
