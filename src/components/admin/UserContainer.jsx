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
        sessionStorage.getItem(`${params.userId}-activeTab`) || "edit"
    );

    useEffect(() => {
        // Update the activeTab in session storage whenever it changes
        sessionStorage.setItem(`${params.userId}-activeTab`, activeTab);
    }, [activeTab, params.userId]);

    useEffect(() => {
        // Navigate to the new activeTab when pathname or activeTab changes
        if (location.pathname === `/users/${params.userId}`) {
            navigate(activeTab, { replace: true });
        }
    }, [navigate, location.pathname, params.userId, activeTab]);

    return (
        <TabContainer>
            <Tab isActive={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
                <SidebarLink to="edit">ویرایش</SidebarLink>
            </Tab>
        </TabContainer>
    );
};

const UserContainer = () => {
    return (
        <div>
            <Tabs/>
            <div>
                <Outlet/>
            </div>
        </div>
    );
};

export default UserContainer;
