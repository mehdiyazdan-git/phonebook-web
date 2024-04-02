import React, { useState } from 'react';
import CreateCustomerForm from './CreateCustomerForm';
import EditCustomerForm from './EditCustomerForm';
import "./customer.css";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';


const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Customers = () => {
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
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



    const handleAddCustomer = async (newCustomer) => {
        const response = await createCustomer(newCustomer);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };

    const handleUpdateCustomer = async (updatedCustomer) => {
        const response = await updateCustomer(updatedCustomer.id, updatedCustomer);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
            setEditingCustomer(null);
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
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="secondary" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <CreateCustomerForm
                    onAddCustomer={handleAddCustomer}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={getAllCustomers}
                onEdit={(customer) => {
                    setEditingCustomer(customer);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteCustomer}
                refreshTrigger={refreshTrigger} // Pass the refresh trigger
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
        </div>
    );
};

export default Customers;
