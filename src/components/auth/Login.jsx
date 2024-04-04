import React from 'react';
import styled from 'styled-components';

import {useForm} from "react-hook-form";
import { BASE_URL } from "../../config/config";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import {useLocation, useNavigate} from "react-router-dom";
import {LoginTextMessage} from "./LoginTextMessage";

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f9f9f9;
  font-family: "IRANSans", sans-serif;
`;

const LoginContainer = styled.div`
  display: flex;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  font-family: "IRANSans", sans-serif;
`;

const LoginFormSection = styled.div`
  background: #fff;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  direction: rtl; // Right-to-left direction for Persian text
  text-align: right;
  font-family: "IRANSans", sans-serif;
`;

const Title = styled.h2`
  font-family: "IRANSans", sans-serif;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const LoginInfoSection = styled.div`
  background: linear-gradient(to right, #ff935c, #ff7b3a);
  color: #fff;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: "IRANSans", sans-serif;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: "IRANSans", sans-serif;
`;

const Button = styled.button`
  padding: 10px;
  background: #ff6464;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-family: "IRANSans", sans-serif;

  &:hover {
    background: #ff4c4c;
  }
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-family: "IRANSans", sans-serif;
`;

const InfoText = styled.p`
  line-height: 1.6;
  font-family: "IRANSans", sans-serif;
  text-align: justify;
  text-justify: inter-word;
`;

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const [errorMessage, setErrorMessage] = React.useState('');
    const auth = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/v1/auth/authenticate`, {
                username: data.username,
                password: data.password
            });

            if (response.status === 200) {
                auth.setAccessToken(response.data.access_token);
                auth.setCurrentUser(response.data.userName);
                auth.setRole(response.data.role);
                navigate(from);
                console.log('Authentication successful:', response.data);
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setErrorMessage('نام کاربری یا رمز عبور اشتباه است');
                        break;
                    default:
                        setErrorMessage('خطایی رخ داده است، لطفاً دوباره تلاش کنید');
                        break;
                }
            } else if (error.request) {
                setErrorMessage('خطا در اتصال به سرور، لطفاً دوباره تلاش کنید');
            } else {
                setErrorMessage('خطایی رخ داده است، لطفاً دوباره تلاش کنید');
            }
            console.error('Authentication error:', error);
        }
    };

    return (
        <LoginWrapper>
            <LoginContainer>
                <LoginFormSection>
                    <Title>شرکت آرمان نوین پیشگامان صبا</Title>
                    <p>لطفاً وارد حساب کاربری خود شوید</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            placeholder="نام کاربری"
                            {...register("username", { required: "نام کاربری الزامی است" })}
                        />
                        {errors.username && <p>{errors.username.message}</p>}

                        <Input
                            placeholder="رمز عبور"
                            type="password"
                            {...register("password", { required: "رمز عبور الزامی است" })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}

                        <Button type="submit">ورود</Button>
                    </form>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </LoginFormSection>
                <LoginInfoSection>
                    <InfoTitle>شرکت آرمان نوین پیشگامان صبا</InfoTitle>
                    <InfoText>
                        {LoginTextMessage}
                    </InfoText>
                </LoginInfoSection>
            </LoginContainer>
        </LoginWrapper>
    );
};

export default Login;
