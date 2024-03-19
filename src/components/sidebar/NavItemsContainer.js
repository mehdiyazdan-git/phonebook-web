import React from 'react';
import { Link } from 'react-router-dom';
import {useNavigationContext} from "../contexts/NavigationContext";

const NavItemsContainer = ({ items, activeLink }) => {
    const { setBaseRoute } = useNavigationContext();

    return (
        <div className="container-fluid" style={{fontSize : "0.8rem"}}>
            {items.map((item) => (
                <div className="row nav-item" key={item.to}>
                    <Link
                        className={`Link ${activeLink === item.to ? 'active' : ''}`}
                        to={item.to}
                        onClick={() => setBaseRoute(item.to, item.caption)}
                    >
                        {item.caption}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NavItemsContainer;
