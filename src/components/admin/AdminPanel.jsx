import React, { useState } from 'react';
import styled from "styled-components";
import Users from "../users/Users";
import FiscalYear from "../year/FiscalYear";
import Positions from "../position/Positions";
import BoardMembers from "../boardmember/BoardMembers";


const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.aside`
  width: 180px;
  background: rgba(52, 58, 64, 0.42);
  color: white;
  height: 70vh;
  overflow-y: auto;
`;

const Content = styled.main`
  flex: 1;
  margin-left: 180px;
  overflow-y: auto;
  height: calc(100vh - 4rem);
`;

const SidebarLink = styled.div`
  display: block;
  padding: 0.5rem;
  color: white;
  font-size: 0.8rem;
  text-decoration: none;
  border: 1px solid #ffffff;
  border-collapse: collapse;
  font-family: "IRANSans", sans-serif;
  cursor: pointer;

  &.active {
    background: #495057;
    color: #f79e2a;
  }

  &:hover {
    background: #495057;
    text-decoration: none;
  }
`;

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <LayoutWrapper>
                <Sidebar>
                    <SidebarLink onClick={() => handleTabClick('users')} className={activeTab === 'users' ? 'active' : ''}>
                        کاربران
                    </SidebarLink>
                    <SidebarLink onClick={() => handleTabClick('year')} className={activeTab === 'year' ? 'active' : ''}>
                       تنظیمات سال و شماره نامه
                    </SidebarLink>
                    <SidebarLink onClick={() => handleTabClick('positions')} className={activeTab === 'positions' ? 'active' : ''}>
                        سمت های هیئت مدیره
                    </SidebarLink>
                </Sidebar>
                <Content>
                    {activeTab === 'users' && <Users />}
                    {activeTab === 'year' && <FiscalYear />}
                    {activeTab === 'positions' && <Positions />}
                    {activeTab === 'board-members' && <BoardMembers />}
                </Content>
            </LayoutWrapper>
        </div>
    );
};

export default AdminPanel;
