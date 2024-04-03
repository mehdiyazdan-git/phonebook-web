import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import NewCompanyForm from "./NewCompanyForm";
import Button from "../../utils/Button";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';
import {SiMicrosoftexcel} from "react-icons/si";
import "./company.css"
import DownloadExcelIcon from "../assets/icons/DownloadExcelIcon";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: row;
  
`;

const Sidebar = styled.aside`
  width: 180px;
  background: rgba(52, 58, 64, 0.42);
  color: white;
  height: 100%;
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
    const [showModal, setShowModal] = useState(false);
    const http = useHttp();

    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const handleAddCompany = async (newCompany) => {
        const response = await http.post("/companies",newCompany);
        if (response.status === 201) {
            setCompanies([...companies, response.data]);
        }
        setCompanies([...companies, response.data]);
    };

    useEffect(() => {
        async function loadData() {
            return await getCompanySelect().then(response => response.data);
        }

        loadData().then(data => {
            setCompanies(data);
            if (data.length > 0) {
                navigate(`${data[0].id}`);
            }
        });
    }, []);

    async function downloadExcelFile() {
        await http.get('/companies/download-all-companies.xlsx',{ responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "companies.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div>
            <LayoutWrapper>
                <Sidebar>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        جدید
                    </Button>
                    <DownloadExcelIcon downloadExcelFile={downloadExcelFile}/>
                    <NewCompanyForm onAddCompany={handleAddCompany} show={showModal} onHide={() => setShowModal(false)}/>
                    {companies.map(company =>
                        <SidebarLink
                            key={company.id}
                            to={`${company.id}`}
                        >
                            {company.name}
                        </SidebarLink>
                    )}
                </Sidebar>
                <Content>
                    <Outlet/>
                </Content>
            </LayoutWrapper>
        </div>
    );
};

export default CompanyPage;
