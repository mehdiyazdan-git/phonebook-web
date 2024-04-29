import './App.css';
import { Outlet, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import IconPowerOff from "./components/assets/icons/IconPoweroff";
import SidebarMenu from "./components/sidebar/SidebarMenu";
import styled from "styled-components";
import {useAuth} from "./hooks/useAuth";
import useHttp from "./hooks/useHttp";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Navbar = styled.div`
  display: flex;
  background-color: rgba(2, 74, 137, 0.49);
  height: 2rem;
  align-items: center;
  padding: 0 1rem;
`;

const NavbarCol = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow-y: auto;
`;

const SidebarWrapper = styled.div`
  flex: 0 0 200px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-top: 0.1rem;
  height: calc(100vh - 35px);
  overflow-y: auto;
`;

const PageContentWrapper = styled.div`
  flex: 1;
  margin-top: 0.1rem;
  overflow-y:auto;
  height: calc(100vh - 35px);
  position: relative;
  background-color: rgba(255,255,255,0.6);
`;

function App() {
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const http = useHttp();
    const auth = useAuth();

    const handleLogout = (event) => {
        event.preventDefault();
        http.post("/v1/auth/logout", {refreshToken : `Bearer ${auth.refreshToken}`
    })
            .then((res) => {
                if (res.status === 204){
                    localStorage.removeItem("token");
                    navigate("/login");
                    console.log(res);
                }
            }).catch((err) => {
            console.log(err);
        });
        };

    return (
        <LayoutWrapper dir="rtl">
            <Navbar>
                <NavbarCol>
                    <span style={{ color: "white",fontFamily:"IRANSans",fontSize:"0.8rem" }}>{` کاربر جاری : ${currentUser}`}</span>
                </NavbarCol>
                <NavbarCol>

                </NavbarCol>
                <NavbarCol>
                    <button style={{ color: "red" }} className="btn" onClick={handleLogout}>
                        <IconPowerOff style={{ color: "#ed8937", fontSize: "30" }} />
                    </button>
                </NavbarCol>
            </Navbar>

            <MainContent>
                <SidebarWrapper>
                    <SidebarMenu />
                </SidebarWrapper>
                <PageContentWrapper>
                    <Outlet />
                </PageContentWrapper>
            </MainContent>
        </LayoutWrapper>
    );
}

export default App;
