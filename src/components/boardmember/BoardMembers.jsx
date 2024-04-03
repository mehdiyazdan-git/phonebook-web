import React, { useState, useEffect } from 'react';
import CreateBoardMemberForm from './CreateBoardMemberForm';
import EditBoardMemberForm from './EditBoardMemberForm';
import SimpleTable from "../table/SimpleTable";
import Button from "../../utils/Button";
import useHttp from "../../hooks/useHttp";
import {useParams} from "react-router-dom";

const BoardMembers = () => {
    const {companyId} = useParams();
    const [boardMembers, setBoardMembers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBoardMember, setSelectedBoardMember] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    useEffect(() => {
        const getAllBoardMembers = async () => {
            if (companyId !== undefined && companyId !== null) {
                return await http.get(`/board-members/all-by-companyId/${Number(companyId)}`)
                    .then(response => response.data);
            }
            return await http.get("/board-members")
                .then(response => response.data);
        };
        getAllBoardMembers().then(data => setBoardMembers(data))
    }, [ refreshTrigger]);

    const createBoardMember = async (data) => {
        return await http.post("/board-members", data);
    };

     const updateBoardMember = async (id, data) => {
        return await http.put(`/board-members/${id}`, data);
    };

     const removeBoardMember = async (id) => {
        return await http.delete(`/board-members/${id}`);
    };

    const handleCreateModalClose = async (newMember) => {
        try {
            const response = await createBoardMember(newMember);
            if (response.status === 201) {
                setRefreshTrigger(!refreshTrigger);
                return '';
            } else {
                throw new Error(response.data.message || "Failed to create board member.");
            }
        } catch (error) {
            console.log(error.message);
            return error.response?.data?.message || "An unexpected error occurred";
        }
    };

    const handleUpdateBoardMember = async (formData) => {
        try {
            console.log("beforeUpdate : " , formData);
            const response = await updateBoardMember(formData.id, formData);
            console.log("afterUpdate : " , response);

            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setSelectedBoardMember(null);
                return '';
            } else {
                throw new Error(response.data.message || "Failed to update board member.");
            }
        } catch (error) {
            console.log(error.message);
            // Return the error message to the caller
            return error.response?.data?.message || "An unexpected error occurred";
        }
    };


    const handleDeleteMember = async (id) => {
        await removeBoardMember(id);
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };

    const columns = [
        { key: 'id', title: 'شناسه' },
        { key: 'fullName', title: 'نام و نام خانوادگی' },
        { key: 'positionName', title: 'سمت' },
        { key: 'companyCompanyName', title: 'شرکت' },
    ];

    return (
        <>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                جدید
            </Button>

            <SimpleTable
                columns={columns}
                data={boardMembers}
                onEdit={(boardMember) => {
                    setSelectedBoardMember(boardMember);
                    setShowEditModal(true);
                }}
                onDelete={handleDeleteMember}
            />


            <CreateBoardMemberForm
                show={showCreateModal}
                onHide={()=>setShowCreateModal(false)}
                onAddBoardMember={handleCreateModalClose}

            />
            {selectedBoardMember && (
                <EditBoardMemberForm
                    show={showEditModal}
                    boardMember={selectedBoardMember}
                    onHide={() => setShowEditModal(false)}
                    onUpdateMemberBoard={handleUpdateBoardMember}
                />
            )}

        </>
    );
};

export default BoardMembers;
