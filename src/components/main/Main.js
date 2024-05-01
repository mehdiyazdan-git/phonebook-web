import React, {useState} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import App from "../../App";
import NewPersonForm from "../person/NewPersonForm";
import EditPersonForm from "../person/EditPersonForm";
import NewLetterForm from "../letters/NewLetterForm";
import EditLetterForm from "../letters/EditLetterForm";

import FiscalYear from "../year/FiscalYear";
import Letters from "../letters/Letters";
import Persons from "../person/Persons";
import NewCompanyForm from "../company/NewCompanyForm";
import CreateCustomerForm from "../customers/CreateCustomerForm";
import Customers from "../customers/Customers";
import EditCustomerForm from "../customers/EditCustomerForm";
import CompanyPage from "../company/CompanyPage";
import CompanyContainer from "../company/CompanyContainer";
import EditCompanyForm from "../company/EditCompanyForm";
import Positions from "../position/Positions";
import CreatePositionForm from "../position/CreatePositionForm";
import EditPositionForm from "../position/EditPositionForm";
import BoardMembers from "../boardmember/BoardMembers";
import CreateBoardMemberForm from "../boardmember/CreateBoardMemberForm";
import EditBoardMemberForm from "../boardmember/EditBoardMemberForm";
import CompanyDocumentList from "../company/CompanyDocumentList";
import RequireAuth from "../auth/RequireAuth";
import Users from "../users/Users";
import Login from "../auth/Login";
import AccessDenied from "../auth/AccessDenied";
import ServerConnectionError from "../auth/ServerConnectionError";
import {IdleTimeoutProvider} from "../contexts/IdleTimeoutProvider";
import CreateUserForm from "../users/CreateUserForm";
import EditUserForm from "../users/EditUserForm";
import AdminPanel from "../admin/AdminPanel";
import ShareHolders from "../ShareHolder/ShareHolders";
import InsuranceSlips from "../InsuranceSlip/InsuranceSlips";
import TaxPaymentSlips from "../TaxPaymentSlip/TaxPaymentSlips";
import RequireRole from "../auth/RequireRole";
import EmptyCompanyPage from "../company/EmptyCompanyPage";
import LoadingDataErrorPage from "../../utils/formComponents/LoadingDataErrorPage";

const Main = () => {
    const navigate = useNavigate();
    const [innerTimeout,setInnerTimeout] = useState(1200000);

    const onIdle = () => {
        navigate('/login');
    };

    return (
        <IdleTimeoutProvider
            onIdle={onIdle}
            timeout={innerTimeout}
        >
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<App/>} >
                        <Route path="/companies" element={<CompanyPage/>}>
                            <Route path=":companyId" element={<CompanyContainer/>}>
                                <Route path="edit" element={<EditCompanyForm/>}/>
                                <Route path="outgoing" element={<Letters/>}/>
                                <Route path="incoming" element={<Letters/>}/>
                                <Route path="documents" element={<CompanyDocumentList/>}/>
                                <Route path="create" element={<NewCompanyForm/>}/>
                                <Route path="outgoing/create" element={<NewLetterForm/>}/>
                                <Route path="board-members" index element={<BoardMembers/>}/>
                                <Route path="shareholders" element={<ShareHolders/>}/>
                                <Route path="insurance-documents" element={<InsuranceSlips/>}/>
                                <Route path="tax-documents" element={<TaxPaymentSlips/>}/>
                                <Route path="empty-page" element={<EmptyCompanyPage/>}/>
                            </Route>
                        </Route>

                        <Route path="/persons" index element={<Persons/>}/>
                        <Route path="/persons/create" element={<NewPersonForm/>}/>
                        <Route path="/persons/:personId/edit" element={<EditPersonForm/>}/>


                        <Route path="/users" index element={<Users/>}/>
                        <Route path="/users/create" element={<CreateUserForm/>}/>
                        <Route path="/users/:userId/edit" element={<EditUserForm/>}/>

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

                        <Route element={<RequireRole roles={['ADMIN']} />}>
                            <Route path="/admin" element={<AdminPanel />}>
                                <Route path="access-denied" element={<AccessDenied />} />
                            </Route>
                        </Route>
                        <Route path="/year" index element={<FiscalYear/>}/>
                        <Route path="server-error" element={<ServerConnectionError />} />
                    </Route>
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/server-error" element={<ServerConnectionError />} />
            </Routes>
        </IdleTimeoutProvider>

    );
};

export default Main;
