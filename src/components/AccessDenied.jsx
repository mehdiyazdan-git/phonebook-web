import React from 'react';
import styled from 'styled-components';

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

const AccessDenied = () => {

    return (
        <ErrorContainer>
            <ErrorMessage>Access Denied</ErrorMessage>
            <ErrorDescription>You do not have permission to view this page.</ErrorDescription>
        </ErrorContainer>
    );
};

export default AccessDenied;
