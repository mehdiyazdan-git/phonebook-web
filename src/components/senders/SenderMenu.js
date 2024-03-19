import React, {useEffect, useState} from 'react';
import { Accordion, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sender from "../../services/senderService";

const SenderMenu = () => {
    const [senders, setSenders] = useState([]);

    useEffect(() => {
        async function loadData() {
            return await Sender.crud.getAllSenders()
        }

        loadData().then(response => setSenders(response.data))
    }, []);

    const navigationMenuStyle = {
        fontFamily: 'IRANSansBold, sans-serif',
        fontSize: "1rem",
        marginTop : "1rem",
    };

    return (
        <div style={navigationMenuStyle}>
            <Accordion activeKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>اندیکاتور</Accordion.Header>
                    <Accordion.Body>
                        {senders.map(sender => (
                            <Nav.Link style={{margin : "1rem"}} as={NavLink} to={`/senders/${sender.id}/letters`} activeClassName="active">
                                {sender.name}
                            </Nav.Link>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default SenderMenu;
