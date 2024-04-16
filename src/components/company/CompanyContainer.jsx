import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useParams, NavLink } from "react-router-dom";
import styled from "styled-components";

export const TabContainer = styled.div`
  display: flex;
  align-items: flex-end;
  background-color: rgba(48, 139, 242, 0.67);
  z-index: 1000;
  overflow-y: auto;
`;

const SidebarLink = styled(NavLink)`
  padding: 8px 16px;
  display: block;
  color: #515151;
  font-family: "IRANSansBold", sans-serif;
  font-size: 0.8rem;
  text-decoration: none;
  width: 100%; // Make SidebarLink fill the entire Tab
`;

const Tab = styled.div`
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
  width: fit-content; // Adjust the width of Tab to fit its content

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: rgba(0, 123, 255, 0.2); // Change background color on hover
    border-top-color: #007bff; // Change border color on hover
    border-right-color: #007bff;
    border-left-color: #007bff;
  }
`;


const Tabs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const [activeTab, setActiveTab] = useState(
        sessionStorage.getItem(`${params.companyId}-activeTab`) || "edit"
    );

    useEffect(() => {
        sessionStorage.setItem(`${params.companyId}-activeTab`, activeTab);
        sessionStorage.setItem('selectedCompanyId', params.companyId);
    }, [activeTab, params.companyId]);

    useEffect(() => {
        if (location.pathname === `/companies/${params.companyId}`) {
            navigate(activeTab, { replace: true });
        }
    }, [navigate, location.pathname, params.companyId, activeTab]);

    return (
        <TabContainer>
            <Tab isActive={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
                <SidebarLink to="edit">ویرایش</SidebarLink>
            </Tab>
            <Tab isActive={activeTab === 'outgoing'} onClick={() => setActiveTab('outgoing')}>
                <SidebarLink to="outgoing">نامه های صادره</SidebarLink>
            </Tab>
            <Tab isActive={activeTab === 'incoming'} onClick={() => setActiveTab('incoming')}>
                <SidebarLink to="incoming">نامه های وارده</SidebarLink>
            </Tab>
            <Tab isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
                <SidebarLink to="documents">مدارک</SidebarLink>
            </Tab>
            <Tab isActive={activeTab === 'board-members'} onClick={() => setActiveTab('board-members')}>
                <SidebarLink to="board-members">هیئت مدیره</SidebarLink>
            </Tab>
            <Tab isActive={activeTab === 'shareholders'} onClick={() => setActiveTab('shareholders')}>
                <SidebarLink to="shareholders">سهامداران</SidebarLink>
            </Tab>
            <Tab isActive={activeTab === 'insurance-documents'} onClick={() => setActiveTab('insurance-documents')}>
                <SidebarLink to="insurance-documents">مدارک بیمه</SidebarLink>
            </Tab>
            <Tab isActive={activeTab === 'tax-documents'} onClick={() => setActiveTab('tax-documents')}>
                <SidebarLink to="tax-documents">مدارک مالیات</SidebarLink>
            </Tab>

        </TabContainer>
    );

};

const CompanyContainer = () => {
    return (
        <div>
            <Tabs />
            <Outlet />
        </div>
    );
};

export default CompanyContainer;
