import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Sender from "../../services/senderService";
import NewSenderForm from "./NewSenderForm";
import Button from "../../utils/Button";

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

const SenderPage = () => {
    const [senders, setSenders] = useState([]);
    const navigate = useNavigate();
    const [showModal,setShowModal] = useState(false);


    const handleAddSender = async (newSender) => {
        const response = await Sender.crud.createSender(newSender);
        if (response.status === 201){
            setSenders([...senders, response.data]);
        }
        setSenders([...senders, response.data]);
    };

    useEffect(() => {
        async function loadData() {
            return await Sender.crud.getAllSenders();
        }

        loadData().then(response => {
            setSenders(response.data);
            if (response.data.length > 0) {
                navigate(`${response.data[0].id}`);
            }
        });
    }, []);

    return (
        <div>
            <LayoutWrapper>
                <Sidebar>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                         ایجاد شرکت
                    </Button>
                    <NewSenderForm onAddSender={handleAddSender} show={showModal} onHide={() => setShowModal(false)}/>
                    {senders.map(sender =>
                        <SidebarLink
                            key={sender.id}
                            to={`${sender.id}`}
                        >
                            {sender.name}
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

export default SenderPage;
