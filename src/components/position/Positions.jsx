import React, { useState } from 'react';
import Table from '../table/Table';
import useHttp from '../../hooks/useHttp';
import EditPositionForm from './EditPositionForm';
import CreatePositionForm from './CreatePositionForm';
import Button from '../../utils/Button';

const Positions = () => {
    const [editingPosition, setEditingPosition] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const getAllPositions = async (queryParams) => {
        return await http.get(`/positions?${queryParams.toString()}`).then((r) => r.data);
    };

    const createPosition = async (data) => {
        return await http.post('/positions', data);
    };

    const updatePosition = async (id, data) => {
        return await http.put(`/positions/${id}`, data);
    };

    const removePosition = async (id) => {
        return await http.delete(`/positions/${id}`);
    };

    const handleAddPosition = async (newPosition) => {
        const response = await createPosition(newPosition);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger);
        }
    };

    const handleUpdatePosition = async (updatedPosition) => {
        const response = await updatePosition(updatedPosition.id, updatedPosition);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger);
            setEditingPosition(null);
        }
    };

    const handleDeletePosition = async (id) => {
        await removePosition(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'name', title: 'نام پست', width: '20%', sortable: true, searchable: true },
        // Add more columns as needed
    ];

    return (
        <div className="table-container">
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    افزودن پست جدید
                </Button>
                <CreatePositionForm
                    onAddPosition={handleAddPosition}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={getAllPositions}
                onEdit={(position) => {
                    setEditingPosition(position);
                    setEditShowModal(true);
                }}
                onDelete={handleDeletePosition}
                refreshTrigger={refreshTrigger}
            />

            {editingPosition && (
                <EditPositionForm
                    position={editingPosition}
                    onUpdatePosition={handleUpdatePosition}
                    show={showEditModal}
                    onHide={() => {
                        setEditingPosition(null);
                        setEditShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Positions;
