import React from 'react';
import styled from 'styled-components';
import { BASE_URL } from "../../config/config";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import {useLocation, useNavigate} from "react-router-dom";
import {TextInput} from "../../utils/formComponents/TextInput";
import Button from "../../utils/Button";
import {Row} from "react-bootstrap";
import * as yup from "yup";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import {Form} from "../../utils/Form";



const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const [errorMessage, setErrorMessage] = React.useState('');
    const auth = useAuth();

    const schema = yup.object({
        username: yup.string().required('نام کاربری خالی باشد'),
        password: yup.string().required('کلمه عبور خالی باشد'),
    }).required();
    const resolver = useYupValidationResolver(schema);
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post(`${BASE_URL}/v1/auth/authenticate`, {
                username: data.username,
                password: data.password
            });

            if (response.status === 200) {
                auth.setAccessToken(response.data.access_token);
                auth.setCurrentUser(response.data.userName);
                auth.setRefreshToken(response.data.refresh_token);
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

                    case 404:
                        setErrorMessage('کاربری با این مشخصات یافت نشت');
                        break;

                    case 500:
                        setErrorMessage('سرور دچار مشکل شده است، لطفا بعدا دوباره تلاش کنید');
                        break;

                    case 503:
                        setErrorMessage('سرویس در حال تعمیر است، لطفا بعدا دوباره تلاش کنید');
                        break;

                    case 504:
                        setErrorMessage('گزارش از سرور دریافت نشد، لطفا بعدا دوباره تلاش کنید');
                        break;

                    case 400:
                        setErrorMessage('درخواست نامعتبر، لطفا دوباره تلاش کنید');
                        break;

                    case 403:
                        setErrorMessage('دسترسی غیر مجاز، لطفا با مدیر سیستم تماس بگیرید');
                        break;

                    case 405:
                        setErrorMessage('درخواست نامعتبر، لطفا دوباره تلاش کنید');
                        break;

                    case 408:
                        setErrorMessage('درخواست تایم ان تمام شد، لطفا دوباره تلاش کنید');
                        break;

                    case 413:
                        setErrorMessage('درخواست بیش از حد انداز شده است، لطفا دوباره تلاش کنید');
                        break;

                    case 429:
                        setErrorMessage('تعداد درخواست های زیاد برای سرویس، لطفا بعدا دوباره تلاش کنید');
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
                    <Title>برنامه مدیریت مکاتبات و مدارک</Title>
                    <p style={{color :"rgba(238, 243, 248, 0.49)"}}>لطفاً وارد حساب کاربری خود شوید</p>
                    <Form
                        onSubmit={onSubmit}
                        defaultValues={{
                            username: '',
                            password: '',
                        }}
                        resolver={resolver}
                    >
                        <Row>
                            <TextInput
                                name={"username"}
                                label={"نام کاربری"}
                                labelStyle={{color:"rgb(75, 190, 230)",fontFamily:"IRANSans",marginBottom:"0"}}
                                backgroundColor="rgba(27, 27, 27, 0.1)"
                            />
                            <TextInput
                                name={"password"}
                                type={"password"}
                                label={"کلمه عبور"}
                                labelStyle={{color:"rgb(75, 190, 230)",fontFamily:"IRANSans",marginBottom:"0"}}
                                backgroundColor="rgba(27, 27, 27, 0.1)"
                            />
                        </Row>
                        <Button variant={"secondary"} type="submit">ورود</Button>
                    </Form>
                    {errorMessage && <p style={{fontSize:"0.7rem"}} className="error-message">{errorMessage}</p>}
            </LoginContainer>
        </LoginWrapper>
    );
};

export default Login;


const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: "IRANSans", sans-serif;
    background: rgba(220,220,220,0.1);
    
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 550px;
    padding: 20px;
    width: 100%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    font-family: "IRANSans", sans-serif;
    background: rgba(231, 230, 230, 0.09);
`;
const Title = styled.h2`
    font-family: "Amine", sans-serif;
    font-size: 1.5rem;
    color: rgb(75, 190, 230);
    margin-bottom: 20px;
`;
