import React from 'react';
import styled from "styled-components";
import { NavLink } from "react-router-dom";



const Sidebar = styled.aside`
  width: 180px;
  background: rgba(52, 58, 64, 0.42);
  color: white;
  height: 100%;
  overflow-y: auto;
`;



const SidebarLink = styled(NavLink)`
  display: block;
  padding: 0.5rem;
  color: white;
  font-size: 0.8rem;
  text-decoration: none;
  border: 1px solid #ffffff;
  border-collapse: collapse;
  font-family: "IRANSans", sans-serif;

  &.active {
    background: #495057;
    color: #f79e2a;
  }

  &:hover {
    background: #495057;
    text-decoration: none;
  }
`;

const SidebarMenu = () => {

    return (
        <Sidebar>
            <SidebarLink to={`/persons`}>لیست اشخاص</SidebarLink>
            <SidebarLink to={`/customers`}>لیست گیرندگان</SidebarLink>
            <SidebarLink to={`/companies`}>شرکت های زیر مجموعه</SidebarLink>
            <SidebarLink to={`/year`}>تعریف سال</SidebarLink>
            <SidebarLink to={`/positions`}>سمت هیئت مدیره</SidebarLink>
            <SidebarLink to={`/board-members`}>اعضای هیئت مدیره</SidebarLink>
            <SidebarLink to="/users">Users</SidebarLink>
        </Sidebar>
    );
};

export default SidebarMenu;
