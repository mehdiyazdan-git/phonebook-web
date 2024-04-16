import React from 'react';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: transparent;
  color: #1a202c;
`;

const Header = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #2c5282;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;


const EmptyCompanyPage = () => {
    return (
        <NotFoundContainer>
            <Header>
                 404
            </Header>
            <Subtitle>
                هیچ رکوردی یافت نشد.
            </Subtitle>
        </NotFoundContainer>
    );
};

export default EmptyCompanyPage;
