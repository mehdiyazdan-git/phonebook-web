import React, { useState, useEffect } from 'react';
import CreateBoardMemberForm from './CreateBoardMemberForm';
import EditBoardMemberForm from './EditBoardMemberForm';
import BoardMemberService from "../../services/boardMemberService";
import SimpleTable from "../table/SimpleTable";
import Button from "../../utils/Button";
import CompanyService from "../../services/companyService";

const BoardMembers = () => {
    const [boardMembers, setBoardMembers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBoardMember, setSelectedBoardMember] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        fetchBoardMembers().then(data => setBoardMembers(data))
    }, [refreshTrigger]);

    const fetchBoardMembers = async () => {
        return  await BoardMemberService.crud.getAllBoardMembers();

    };

    const handleCreateModalClose = async (newMember) => {
        const response = await BoardMemberService.crud.createBoardMember(newMember);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };
    const handleDeleteMember = async (id) => {
        await BoardMemberService.crud.removeBoardMember(id);
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };

    const handleUpdateBoardMember = async (formData) => {
        console.log("beforeUpdate : " , formData)
        const response = await BoardMemberService.crud.updateBoardMember(formData.id, formData);
        console.log("afterUpdate : " , response)
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger);
            setSelectedBoardMember(null);
        }
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
