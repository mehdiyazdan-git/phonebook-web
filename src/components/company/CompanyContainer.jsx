import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

const TabContainer = styled.div`
  display: flex;
  align-items: flex-end;
  background-color: rgba(48, 139, 242, 0.67);
  z-index: 1000;
  overflow-y: auto;
`;

const Tab = styled.div`
  padding: 8px 16px;
  cursor: pointer;
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

const SidebarLink = styled(NavLink)`
  display: block;
  padding: 0.1rem;
  color: #515151;
  font-family: "IRANSansBold", sans-serif;
  font-size: 0.8rem;
  text-decoration: none;
`;

const Tabs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    // Initialize activeTab from session storage or fallback to 'edit'
    const [activeTab, setActiveTab] = useState(
        sessionStorage.getItem(`${params.companyId}-activeTab`) || "edit"
    );


    useEffect(() => {
        // Update the activeTab in session storage whenever it changes
        sessionStorage.setItem(`${params.companyId}-activeTab`, activeTab);
    }, [activeTab, params.companyId]);

    useEffect(() => {
        // Navigate to the new activeTab when pathname or activeTab changes
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
        </TabContainer>
    );
};

const CompanyContainer = () => {
    return (
        <div>
            <Tabs/>
            <div>
                <Outlet/>
            </div>
        </div>
    );
};

export default CompanyContainer;
