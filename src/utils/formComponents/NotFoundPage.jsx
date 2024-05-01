import React from 'react';
import styled from 'styled-components';

// Styles
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
`;

const ErrorCode = styled.h1`
  font-size: 5rem;
  font-weight: bold;
  color: #6c757d;
`;

const Description = styled.p`
  font-size: 1.5rem;
  color: #6c757d;
`;

const GoHomeButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

// Component
const NotFoundPage = () => {
    return (
        <PageContainer>
            <ErrorCode>404</ErrorCode>
            <Description>Page Not Found</Description>
            <GoHomeButton onClick={() => window.history.back()}>Go Home</GoHomeButton>
        </PageContainer>
    );
};

export default NotFoundPage;
