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
`;

const ErrorDescription = styled.p`
  color: #333;
  font-size: 18px;
`;

const RetryButton = styled.button`
    padding: 10px 20px;
    font-size: 18px;
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
            <ErrorMessage>Server Connection Error</ErrorMessage>
            <ErrorDescription>Sorry, we're having trouble connecting to the server. Please try again later.</ErrorDescription>
            <RetryButton onClick={handleRetry}>Go to Login Page</RetryButton>
        </ErrorContainer>
    );
};

export default ServerConnectionError;
