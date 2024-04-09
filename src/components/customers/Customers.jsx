import React, { useState } from 'react';
import CreateCustomerForm from './CreateCustomerForm';
import EditCustomerForm from './EditCustomerForm';
import "./customer.css";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';
import FileUpload from "../../utils/formComponents/FileUpload";
import DownloadTemplate from "../../utils/formComponents/DownloadTemplate";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import Modal from "react-bootstrap/Modal";


const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Customers = () => {
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const http = useHttp();


     const getAllCustomers = async (queryParams) => {
        return await http.get(`/customers?${queryParams.toString()}`).then(r => r.data);
    };

     const createCustomer = async (data) => {
        return await http.post("/customers", data);
    };

     const updateCustomer = async (id, data) => {
        return await http.put(`/customers/${id}`, data);
    };

     const removeCustomer = async (id) => {
        return await http.delete(`/customers/${id}`);
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


    const handleAddCustomer = async (newCustomer) => {
        try {
            const response = await createCustomer(newCustomer);
            if (response.status === 201) {
                setRefreshTrigger(!refreshTrigger); // Refresh the table data
                setShowModal(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    };


    const handleUpdateCustomer = async (updatedCustomer) => {
        try {
            const response = await updateCustomer(updatedCustomer.id, updatedCustomer);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger); // Refresh the table data
                setEditShowModal(false);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    };

    const handleDeleteCustomer = async (id) => {
        await removeCustomer(id);
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'name', title: 'نام', width: '18%', sortable: true, searchable: true },
        { key: 'address', title: 'آدرس', width: '35%', sortable: true, searchable: true },
        { key: 'phoneNumber', title: 'شماره تماس', width: '7%', sortable: true, searchable: true },
        { key: 'nationalIdentity', title: 'شناسه ملی', width: '7%', sortable: true, searchable: true },
        { key: 'registerCode', title: 'کد ثبتی', width: '7%', sortable: true, searchable: true },
        { key: 'registerDate', title: 'تاریخ ثبت', width: '7%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.registerDate) },
    ];

    async function downloadExcelFile() {
        await http.get('/customers/download-all-customers.xlsx',{ responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "customers.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={"/customers/import"}/>}>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="success" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <DownloadTemplate
                    downloadUrl="/customers/template"
                    buttonLabel="فرمت بارگذاری"
                    fileName="customer_template.xlsx"
                />
                <CreateCustomerForm
                    onAddCustomer={handleAddCustomer}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>
            <Table
                columns={columns}
                fetchData={getAllCustomers}
                onEdit={(customer) => {
                    setEditingCustomer(customer);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteCustomer}
                refreshTrigger={refreshTrigger}
            />

            {editingCustomer && (
                <EditCustomerForm
                    customer={editingCustomer}
                    show={showEditModal}
                    onUpdateCustomer={handleUpdateCustomer}
                    onHide={() => {
                        setEditingCustomer(null);
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

export default Customers;
