import React, { useState, useEffect } from 'react';
import CreatePositionForm from './CreatePositionForm';
import EditPositionForm from './EditPositionForm';
import PositionService from '../../services/positionService'; // Adjust the import path as needed
import Button from "../../utils/Button";
import "./position.css";
import SimpleTable from "../table/SimpleTable"; // Ensure this path is correct

const Positions = () => {
    const [positions, setPositions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await PositionService.crud.getAllPositions();
            setPositions(response); // Assuming response.data is the array of positions
        };

        fetchData().catch(console.error);
    }, [refreshTrigger]); // Dependency on refreshTrigger to re-fetch when needed

    const handleAddPosition = async (newPosition) => {
        const response = await PositionService.crud.createPosition(newPosition);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };

    const handleUpdatePosition = async (updatedPosition) => {
        const response = await PositionService.crud.updatePosition(updatedPosition.id, updatedPosition);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
            setEditingPosition(null);
        }
    };

    const handleDeletePosition = async (id) => {
        await PositionService.crud.removePosition(id);
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };

    const columns = [
        { key: 'id', title: 'شناسه' },
        { key: 'name', title: 'نام پست' },
        // ... add other columns as needed
    ];

    return (
        <div className="table-container">
            <span style={{ fontFamily: "IRANSansBold", fontSize: "1.2rem" }}>لیست پست‌ها</span>
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
            <SimpleTable
                columns={columns}
                data={positions}
                onEdit={(position) => {
                    setEditingPosition(position);
                    setEditShowModal(true);
                }}
                onDelete={handleDeletePosition}
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
