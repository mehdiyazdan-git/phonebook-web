import React, {useState} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import App from "../App";
import NewPersonForm from "./person/NewPersonForm";
import EditPersonForm from "./person/EditPersonForm";
import NewLetterForm from "./letters/NewLetterForm";
import EditLetterForm from "./letters/EditLetterForm";
import NotFoundPage from "./senders/NotFoundPage";
import FiscalYear from "./year/FiscalYear";
import Letters from "./letters/Letters";
import Persons from "./person/Persons";
import NewCompanyForm from "./company/NewCompanyForm";
import CreateCustomerForm from "./customers/CreateCustomerForm";
import Customers from "./customers/Customers";
import EditCustomerForm from "./customers/EditCustomerForm";
import CompanyPage from "./company/CompanyPage";
import CompanyContainer from "./company/CompanyContainer";
import EditCompanyForm from "./company/EditCompanyForm";
import Positions from "./position/Positions";
import CreatePositionForm from "./position/CreatePositionForm";
import EditPositionForm from "./position/EditPositionForm";
import BoardMembers from "./boardmember/BoardMembers";
import CreateBoardMemberForm from "./boardmember/CreateBoardMemberForm";
import EditBoardMemberForm from "./boardmember/EditBoardMemberForm";
import CompanyDocumentList from "./company/CompanyDocumentList";
import RequireAuth from "./auth/RequireAuth";
import Users from "./users/Users";
import Login from "./auth/Login";
import {useAuth} from "./hooks/useAuth";
import AccessDenied from "./AccessDenied";
import ServerConnectionError from "./ServerConnectionError";
import {IdleTimeoutProvider} from "./contexts/IdleTimeoutProvider";

const Main = () => {

    const navigate = useNavigate();
    const [innerTimeout,setInnerTimeout] = useState(1200000);

    const onIdle = () => {
        navigate('/login');
    };

    const {role} = useAuth();

    return (
        <IdleTimeoutProvider
            onIdle={onIdle}
            timeout={innerTimeout}
        >
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<App/>}>
                        <Route path="/persons" index element={<Persons/>}/>
                        <Route path="/persons/create" element={<NewPersonForm/>}/>
                        <Route path="/persons/:personId/edit" element={<EditPersonForm/>}/>

                        <Route path="/letters" index element={<Letters/>}/>
                        <Route path="/letters/create" element={<NewLetterForm/>}/>
                        <Route path="/letters/:letterId/edit" element={<EditLetterForm/>}/>

                        <Route path="/customers" index element={<Customers/>}/>
                        <Route path="/customers/create" element={<CreateCustomerForm/>}/>
                        <Route path="/customers/:customerId/edit" element={<EditCustomerForm/>}/>

                        <Route path="/positions" index element={<Positions/>}/>
                        <Route path="/positions/create" element={<CreatePositionForm/>}/>
                        <Route path="/positions/:positionId/edit" element={<EditPositionForm/>}/>

                        <Route path="/board-members" index element={<BoardMembers/>}/>
                        <Route path="/board-members/create" element={<CreateBoardMemberForm/>}/>
                        <Route path="/board-members/:boardMemberId/edit" element={<EditBoardMemberForm/>}/>


                        <Route path="/companies" element={<CompanyPage/>}>
                            <Route path=":companyId" element={<CompanyContainer/>}>
                                <Route path="edit" element={<EditCompanyForm/>}/>
                                <Route path="outgoing" element={<Letters/>}/>
                                <Route path="incoming" element={<Letters/>}/>
                                <Route path="documents" element={<CompanyDocumentList/>}/>
                                <Route path="create" element={<NewCompanyForm/>}/>
                                <Route path="outgoing/create" element={<NewLetterForm/>}/>
                                <Route path="*" element={<NotFoundPage/>}/>
                            </Route>
                        </Route>
                        <Route path="/year" index element={<FiscalYear/>}/>
                    </Route>
                    <Route path="users"
                           element={
                               (role && role ==="ADMIN")
                                   ? <Users/>
                                   : <AccessDenied />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/server-error" element={<ServerConnectionError />} />
            </Routes>
        </IdleTimeoutProvider>

    );
};

export default Main;
