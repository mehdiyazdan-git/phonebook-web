import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ErrorContainer = styled.div`
  text-align: center;
  padding: 50px;
`;

const ErrorMessage = styled.h1`
  color: red;
  font-size: 24px;
  margin-bottom: 20px;
  font-family: "IRANSansBold", sans-serif;
`;

const ErrorDescription = styled.p`
  color: #333;
  font-size: 18px;
  font-family: "IRANSans", sans-serif;
`;

const RetryButton = styled.button`
    padding: 10px 20px;
    font-size: 18px;
    font-family: "IRANSansBold", sans-serif;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const ServerConnectionError = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate('/login');
    };

    return (
        <ErrorContainer>
            <ErrorMessage>خطای اتصال به سرور</ErrorMessage>
            <ErrorDescription>متاسفیم، در اتصال به سرور مشکل داریم. لطفا بعدا دوباره امتحان کنید.</ErrorDescription>
            <RetryButton onClick={handleRetry}>برو به صفحه ورود</RetryButton>
        </ErrorContainer>
    );

};

export default ServerConnectionError;
