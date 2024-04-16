import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import "./company.css"

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.aside`
  width: 180px;
  background: rgba(52, 58, 64, 0.42);
  color: white;
  height: calc(100vh - 100px);
  overflow-y: auto; // Allows scrolling of the Sidebar independently if needed
`;

const Content = styled.main`
  flex: 1;
  margin-left: 180px; // Adjust this value to the width of your Sidebar
  overflow-y: auto;
  height: calc(100vh - 4rem); // Adjust this value to the height of your Navbar
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

const CompanyPage = () => {
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    const http = useHttp();
    const location = useLocation();

    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    useEffect(() => {
        async function loadData() {
            try {
                const response = await getCompanySelect();
                const data = response.data;
                setCompanies(data);
                if (!Array.isArray(data)) {
                    if (!data.length > 0) {
                        navigate(`${data[0].id}`)
                    } else {
                        navigate('/companies/empty-page',{
                            state: { message: 'شرکتی وجود ندارد' },
                            replace: true,
                        })
                    }
                    sessionStorage.setItem('company-location', location.pathname);
                }
            } catch (error) {
                if (error.request) {
                    navigate('/login');
                }
                if (error.response){
                    navigate('/companies/empty-page',{
                        state: { message: 'شرکتی وجود ندارد' },
                        replace: true,
                    })
                }
            }
        }
        loadData();
    }, []);

    return (
        <div>
            <LayoutWrapper>
                <Sidebar>
                    {Array.isArray(companies) && companies.length > 0 ?
                        companies.map(company =>
                            <SidebarLink
                                key={company.id}
                                to={`${company.id}`}
                            >
                                {company.name}
                            </SidebarLink>
                        ) : <div
                            style={{
                                marginTop:"20px",
                                fontFamily:"IRANSansBold",
                                fontSize:"0.8rem",
                                borderRadius:"10px",
                                backgroundColor:"#4c4c4c",
                                color:"#b76513",
                                textIndent:"5px",
                                margin:""
                        }}>
                            {"هیچ رکوردی یافت نشد."}
                    </div>
                    }

                </Sidebar>
                <Content>
                    <Outlet/>
                </Content>
            </LayoutWrapper>
        </div>
    );
};

export default CompanyPage;
