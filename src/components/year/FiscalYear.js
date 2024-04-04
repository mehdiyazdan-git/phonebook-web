import React, { useState } from 'react';
import Table from '../table/Table';
import useHttp from '../../hooks/useHttp';
import EditYearForm from './EditYearForm';
import CreateYearForm from './CreateYearForm';
import Button from '../../utils/Button';

const FiscalYear = () => {
    const [editingYear, setEditingYear] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const getAllYears = async (queryParams) => {
        return await http.get(`/years?${queryParams.toString()}`).then((r) => r.data);
    };

    const createYear = async (data) => {
        return await http.post('/years', data);
    };

    const updateYear = async (id, data) => {
        return await http.put(`/years/${id}`, data);
    };

    const removeYear = async (id) => {
        return await http.delete(`/years/${id}`);
    };

    const handleAddYear = async (newYear) => {
        const response = await createYear(newYear);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger);
        }
    };

    const handleUpdateYear = async (updatedYear) => {
        const response = await updateYear(updatedYear.id, updatedYear);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger);
            setEditingYear(null);
        }
    };

    const handleDeleteYear = async (id) => {
        await removeYear(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'name', title: 'سال', width: '20%', sortable: true, searchable: true },
    ];

    return (
        <div className="table-container">
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <CreateYearForm
                    onAddYear={handleAddYear}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={getAllYears}
                onEdit={(year) => {
                    setEditingYear(year);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteYear}
                refreshTrigger={refreshTrigger}
            />

            {editingYear && (
                <EditYearForm
                    year={editingYear}
                    show={showEditModal}
                    onUpdateYear={handleUpdateYear}
                    onHide={() => {
                        setEditingYear(null);
                        setEditShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default FiscalYear;
