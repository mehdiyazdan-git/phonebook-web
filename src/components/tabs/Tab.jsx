import styled from "styled-components";

export const Tab = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-family: "IRANSans", sans-serif;
  font-size: 0.8rem;
  border-radius: 5px 5px 0 0;
  background-color: ${props => props.isActive ? '#fff' : 'transparent'};
  color: ${props => props.isActive ? '#000' : '#fff'};
  border-top: 2px solid ${props => props.isActive ? '#007bff' : 'transparent'};
  border-right: 2px solid ${props => props.isActive ? '#007bff' : 'transparent'};
  border-left: 2px solid ${props => props.isActive ? '#007bff' : 'transparent'};
  border-collapse: collapse;
  z-index: 1;
  margin-right: 1px;

  &:last-child {
    margin-right: 0;
  }
`;