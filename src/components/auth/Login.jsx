import React from 'react';
import styled from 'styled-components';
import { useAuth } from "../../hooks/useAuth";
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
        const result = await auth.login(data.username, data.password);
        if (result === true) {
            navigate(from); // Navigate after successful login
        } else {
            handleErrors(result); // Handle errors based on the error response
        }
    };

    const handleErrors = (response) => {
        switch (response.status) {
            case 401:
                setErrorMessage('Incorrect username or password');
                break;
            case 404:
                setErrorMessage('User not found');
                break;
            case 500:
                setErrorMessage('Server error, please try again later');
                break;
            default:
                setErrorMessage('An error occurred, please try again');
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
                    {errorMessage && <p style={{fontSize:"0.9rem",color:"#e4c540"}} >{errorMessage}</p>}
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
