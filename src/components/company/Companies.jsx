import React, { useState } from 'react';
import NewCompanyForm from './NewCompanyForm';
import ModalEditCompanyForm from './ModalEditCompanyForm';
import "./company.css";
import CompanyService from "../../services/companyService";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import useHttp from "../hooks/useHttp";

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Companies = () => {
    const [editingCompany, setEditingCompany] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const {http} = useHttp();

     const getAllCompanies = async (queryParams) => {
        return await http.get(`/companies?${queryParams.toString()}`).then(r => r.data);
    };

     const getCompanyById = async (id) => {
        return await http.get(`/${id}`);
    };

     const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
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

     const search = async (searchQuery) => {
        return await http.get(`/companies/search?searchQuery=${searchQuery}`).then(response => response.data);
    };

    const handleAddCompany = async (newCompany) => {
        const response = await createCompany(newCompany);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };

    const handleUpdateCompany = async (updatedCompany) => {
        const response = await updateCompany(updatedCompany.id, updatedCompany);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
            setEditingCompany(null);
        }
    };

    const handleDeleteCompany = async (id) => {
        await removeCompany(id);
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'companyName', title: 'نام شرکت', width: '15%', sortable: true, searchable: true },
        { key: 'nationalId', title: 'شناسه ملی', width: '15%', sortable: true, searchable: true },
        { key: 'registrationNumber', title: 'شماره ثبت', width: '15%', sortable: true, searchable: true },
        { key: 'registrationDate', title: 'تاریخ ثبت', width: '10%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.registrationDate) },
        { key: 'address', title: 'آدرس', width: '15%', sortable: true, searchable: true },
        { key: 'phoneNumber', title: 'شماره تلفن', width: '10%', sortable: true, searchable: true },
        { key: 'faxNumber', title: 'شماره فکس', width: '10%', sortable: true, searchable: true },
        // Add more columns as needed
    ];

    return (
        <div className="table-container">
            <span style={{ fontFamily: "IRANSansBold", fontSize: "1.2rem" }}>لیست شرکت‌ها</span>
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <NewCompanyForm
                    onAddCompany={handleAddCompany}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
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
        </div>
    );
};

export default Companies;
