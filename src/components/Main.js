import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import App from "../App";
import NewPersonForm from "./person/NewPersonForm";
import EditPersonForm from "./person/EditPersonForm";
import NewLetterForm from "./letters/NewLetterForm";
import EditLetterForm from "./letters/EditLetterForm";
import SenderPage from "./senders/SenderPage";
import SenderContainer from "./senders/SenderContainer";
import EditSenderForm from "./senders/EditSenderForm";
import SenderLetters from "./senders/SenderLetters";
import NewSenderForm from "./senders/NewSenderForm";
import NotFoundPage from "./senders/NotFoundPage";
import FiscalYear from "./year/FiscalYear";
import {NavigationProvider} from "./contexts/NavigationContext";
import Letters from "./letters/Letters";
import Persons from "./person/Persons";
import Companies from "./company/Companies";
import NewCompanyForm from "./company/NewCompanyForm";
import ModalEditCompanyForm from "./company/ModalEditCompanyForm";
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

const Main = () => {

    return (
        <NavigationProvider>
            <Router>
                <Routes>
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
                                <Route path="create" element={<NewCompanyForm/>}/>
                                <Route path="outgoing/create" element={<NewLetterForm/>}/>
                                <Route path="*" element={<NotFoundPage/>}/>
                            </Route>
                        </Route>
                        <Route path="/year" index element={<FiscalYear/>}/>

                    </Route>
                </Routes>
            </Router>
        </NavigationProvider>
    );
};

export default Main;
