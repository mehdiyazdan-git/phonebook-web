import React, { useState } from 'react';
import Table from '../table/Table';
import useHttp from '../../hooks/useHttp';
import EditBoardMemberForm from './EditBoardMemberForm';
import CreateBoardMemberForm from './CreateBoardMemberForm';
import Button from '../../utils/Button';
import {useParams} from "react-router-dom";

const BoardMembers = () => {
    const {companyId} = useParams();
    const [editingBoardMember, setEditingBoardMember] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const getAllBoardMembers = async (queryParams) => {
        if (companyId !== null && companyId !== undefined){
            return await http
                .get(`/board-members?companyId=${Number(companyId)}&${queryParams.toString()}`)
                .then((r) => r.data);
        }else {
            return await http
                .get(`/board-members?${queryParams.toString()}`)
                .then((r) => r.data);
        }
    };
    const createBoardMember = async (newBoardMember) => {
        return await http.post('/board-members', newBoardMember);
    }

    const updateBoardMember = async (id, data) => {
        return await http.put(`/board-members/${id}`, data);
    };

    const removeBoardMember = async (id) => {
        return await http.delete(`/board-members/${id}`);
    };

    const handleAddBoardMember =  async (newBoardMember) => {
        try{
             const response = await createBoardMember(newBoardMember);
             if (response.status === 201) {
                 setShowModal(false);
                 setRefreshTrigger(!refreshTrigger);
             }
        }catch(error){
            return error.response.data
        }
    };

    const handleUpdateBoardMember = async (updatedBoardMember) => {
        try{
            const response = await updateBoardMember(updatedBoardMember.id, updatedBoardMember);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingBoardMember(null);
            }
        }catch(error){
            console.error(error);
            return error.response.data
        }
    };

    const handleDeleteBoardMember = async (id) => {
        await removeBoardMember(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        {
            key: 'fullName',
            title: 'نام و نام خانوادگی',
            width: '20%',
            sortable: true,
            searchable: true,
            render: (item) => `${item.personFirstName} ${item.personLastName}` },
        { key: 'positionName', title: 'سمت', width: '15%', sortable: true, searchable: true },
        { key: 'companyCompanyName', title: 'شرکت', width: '20%', sortable: true, searchable: true },
    ];

    return (
        <div className="table-container">
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    افزودن عضو جدید
                </Button>
                <CreateBoardMemberForm
                    onAddBoardMember={handleAddBoardMember}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    companyId={Number(companyId)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={getAllBoardMembers}
                onEdit={(boardMember) => {
                    setEditingBoardMember(boardMember);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteBoardMember}
                refreshTrigger={refreshTrigger}
            />

            {editingBoardMember && (
                <EditBoardMemberForm
                    boardMember={editingBoardMember}
                    onUpdateMemberBoard={handleUpdateBoardMember}
                    show={showEditModal}
                    onHide={() => {
                        setEditingBoardMember(null);
                        setEditShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default BoardMembers;
