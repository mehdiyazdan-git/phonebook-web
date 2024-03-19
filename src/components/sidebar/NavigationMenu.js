import React from 'react';
import './navigationMenu.css';
import NavItemsContainer from './NavItemsContainer';

import { useNavigationContext } from '../contexts/NavigationContext';
import {SlPeople} from "react-icons/sl";
import {GrDocumentText} from "react-icons/gr";
import {BsPersonVideo2, BsPersonVideo3} from "react-icons/bs";
import {IoSettingsOutline} from "react-icons/io5";

const LinkCaption = ({ name, icon }) => {
    return (
        <div
            style={{
                fontFamily: 'IRANSansMedium , sans-serif',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                margin: '10px 0',
            }}
        >
            {icon} {name}
        </div>
    );
};

export default function NavigationMenu() {
    const { activeBaseRoute } = useNavigationContext();

    const navItems = [
        { caption: 'لیست اشخاص', to: '/persons', icon: <SlPeople style={{ fontSize: '1.2rem', color: 'dodgerblue', margin: '0 0.5rem' }} /> },
        { caption: 'ایجاد شخص جدید', to: '/persons/create', icon: <SlPeople style={{ fontSize: '1.2rem', color: 'dodgerblue', margin: '0 0.5rem' }} /> },
        { caption: 'لیست نامه ها', to: '/letters', icon: <GrDocumentText style={{ fontSize: '1.2rem', color: 'rgba(120,104,8,0.49)', margin: '0 0.5rem' }} /> },
        { caption: 'ایجاد نامه جدید', to: '/letters/create', icon: <GrDocumentText style={{ fontSize: '1.2rem', color: 'rgba(120,104,8,0.49)', margin: '0 0.5rem' }} /> },
        { caption: 'لیست گیرندگان', to: '/customers', icon: <BsPersonVideo2 style={{ fontSize: '1.2rem', color: '#782aca', margin: '0 0.5rem' }} /> },
        { caption: 'ایجاد گیرنده جدید', to: '/customers/create', icon: <BsPersonVideo2 style={{ fontSize: '1.2rem', color: '#782aca', margin: '0 0.5rem' }} /> },
        { caption: 'لیست شرکتها', to: '/senders', icon: <BsPersonVideo3 style={{ fontSize: '1.2rem', color: '#416a05', margin: '0 0.5rem' }} /> },
        { caption: 'ایجاد شرکت', to: '/senders/create', icon: <BsPersonVideo3 style={{ fontSize: '1.2rem', color: '#416a05', margin: '0 0.5rem' }} /> },
        { caption: 'تعریف سال', to: '/year', icon: <IoSettingsOutline style={{ fontSize: '1.2rem', color: '#4c4045', margin: '0 0.5rem' }} /> },
    ];

    const navigationMenuStyle = {
        fontFamily: 'IRANSansBold, sans-serif',
        fontSize: '0.7rem',
        marginTop: '1rem',
        backgroundColor: 'transparent',
    };

    return (
        <div style={navigationMenuStyle}>
            {navItems.map((item, index) => (
                <React.Fragment key={index}>
                    <LinkCaption icon={item.icon} name={item.caption} />
                    <NavItemsContainer items={[item]} activeLink={activeBaseRoute} />
                </React.Fragment>
            ))}
        </div>
    );
}
