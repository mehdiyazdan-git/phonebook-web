import React, { useState } from 'react';
import NewCompanyForm from './NewCompanyForm';
import ModalEditCompanyForm from './ModalEditCompanyForm';
import "./company.css";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';
import Modal from "react-bootstrap/Modal";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import FileUpload from "../../utils/formComponents/FileUpload";

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Companies = () => {
    const [editingCompany, setEditingCompany] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const [errorMessage, setErrorMessage] = useState('');


    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleCloseErrorModal = () => setShowErrorModal(false);

     const getAllCompanies = async (queryParams) => {
        return await http.get(`/companies?${queryParams.toString()}`).then(r => r.data);
    };
     const createCompany = async (data) => {
        return await http.post("/companies", data);
    };

     const updateCompany = async (id, data) => {
        return await http.put(`/companies/${id}`, data);
    };

     const removeCompany = async (id) => {
        return await http.delete(`/companies/${id}`);
    };

    const ErrorModal = ({ show, handleClose, errorMessage }) => {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body className="text-center" style={{ fontFamily: "IRANSans",fontSize: "0.8rem", padding: "20px",fontWeight: "bold"}}>
                    <div className="text-danger">{errorMessage}</div>
                    <button className="btn btn-primary btn-sm mt-4" onClick={handleClose}>
                        بستن
                    </button>
                </Modal.Body>
            </Modal>
        );
    };

    const handleAddCompany = async (newCompany) => {
       try {
            const response = await createCompany(newCompany);
            if (response.status === 201) {
                setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
                setShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error adding company:', error);
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
       }
    };

    const handleUpdateCompany = async (updatedCompany) => {
        try {
            const response = await updateCompany(updatedCompany.id, updatedCompany);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
                setEditShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error updating company:', error);
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    }

    const handleDeleteCompany = async (id) => {
       try {
           const response = await removeCompany(id);
           if (response.status === 204) {
               setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
           }
       }catch (error){
           if (error.response){
               return error.response.data;
           }
       }
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'companyName', title: 'نام شرکت', width: '40%', sortable: true, searchable: true },
        { key: 'nationalId', title: 'شناسه ملی', width: '10%', sortable: true, searchable: true },
        { key: 'phoneNumber', title: 'شماره تلفن', width: '10%', sortable: true, searchable: true },
        { key: 'faxNumber', title: 'شماره فکس', width: '10%', sortable: true, searchable: true },
        // Add more columns as needed
    ];

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
        <div className="table-container">
            <span style={{ fontFamily: "IRANSansBold", fontSize: "1.2rem" }}>لیست شرکت‌ها</span>
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/companies/import-companies`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger}/>}>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="secondary" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <NewCompanyForm
                    onAddCompany={handleAddCompany}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>
            <Table
                columns={columns}
                fetchData={getAllCompanies}
                onEdit={(company) => {
                    setEditingCompany(company);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteCompany}
                refreshTrigger={refreshTrigger} // Pass the refresh trigger
            />

            {editingCompany && (
                <ModalEditCompanyForm
                    company={editingCompany}
                    show={showEditModal}
                    onUpdateCompany={handleUpdateCompany}
                    onHide={() => {
                        setEditingCompany(null);
                        setEditShowModal(false);
                    }}
                />
            )}
            <ErrorModal
                show={showErrorModal}
                handleClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Companies;
