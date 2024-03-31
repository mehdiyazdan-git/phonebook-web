import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import {Tab} from "../tabs/Tab";
import {SidebarLink} from "../tabs/SidebarLink";
import {TabContainer} from "../tabs/TabContainer";



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
            <Tab isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
                <SidebarLink to="documents">مدارک</SidebarLink>
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
