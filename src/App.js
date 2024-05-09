import './App.css';
import { Outlet, useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import IconPowerOff from "./components/assets/icons/IconPoweroff";
import SidebarMenu from "./components/sidebar/SidebarMenu";
import styled from "styled-components";
import {useAuth} from "./hooks/useAuth";
import useHttp from "./hooks/useHttp";
import PersianDateTime from "./utils/formComponents/PersianDateTime";

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
    const [fullName , setFullName] = useState("");
    const {currentUser} = useAuth();
    const http = useHttp();
    const auth = useAuth();
    const navigate = useNavigate();

    const getFullNameByUsername = async (username) => {
        try {
            const response = await http.get(`/users/${username}/fullName`);
            if (response.status === 200){
                return response;
            }
        }catch (e){
            console.log(e)
            navigate('/login')
        }
    }
    useEffect(() => {
        try {
            getFullNameByUsername(currentUser).then(res => {
                setFullName(res?.data ? res.data : "نامشخص");
            })
        }catch (e){
            console.log(e);
        }
    })


    return (
        <LayoutWrapper dir="rtl">
            <Navbar>
                <NavbarCol>
                    <span style={{ color: "white",fontFamily:"IRANSans",fontSize:"0.8rem" }}>{` کاربر جاری : ${fullName}`}</span>
                </NavbarCol>
                <NavbarCol>
                        <PersianDateTime/>
                </NavbarCol>
                <NavbarCol>
                    <button style={{ color: "red" }} className="btn" onClick={auth.logout}>
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
