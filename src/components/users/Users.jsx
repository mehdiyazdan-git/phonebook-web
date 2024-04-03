import React, { useState } from 'react';
import Table from '../table/Table';
import useHttp from '../../hooks/useHttp';
import { saveAs } from 'file-saver';
import moment from 'jalali-moment';
import EditUserForm from "./EditUserForm";
import CreateUserForm from "./CreateUserForm";
import Button from "../../utils/Button";

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Users = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const getAllUsers = async (queryParams) => {
        return await http.get(`/users?${queryParams.toString()}`).then((r) => r.data);
    };

    const createUser = async (data) => {
        return await http.post('/users', data);
    };

    const updateUser = async (id, data) => {
        return await http.put(`/users/${id}`, data);
    };

    const removeUser = async (id) => {
        return await http.delete(`/users/${id}`);
    };

    const handleAddUser = async (newUser) => { // Function name updated
        const response = await createUser(newUser); // Variable name updated
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };

    const handleUpdateUser = async (updatedUser) => { // Already correct
        const response = await updateUser(updatedUser.id, updatedUser);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
            setEditingUser(null);
        }
    };

    const handleDeleteUser = async (id) => { // Function name updated
        await removeUser(id); // Assuming a corresponding "removeUser" function exists
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };


    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'fullName', title: 'نام کامل', width: '20%', sortable: true, searchable: true,
            render: (item) => `${item.firstname} ${item.lastname}`
        },
        { key: 'email', title: 'ایمیل', width: '20%', sortable: true, searchable: true },
        { key: 'role', title: 'نقش', width: '15%', sortable: true, searchable: true },
    ];


    async function downloadExcelFile() {
        await http.get('/customers/download-all-customers.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, 'customers.xlsx');
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
                <CreateUserForm
                    onAddUser={handleAddUser}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={getAllUsers}
                onEdit={(customer) => {
                    setEditingUser(customer);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteUser}
                refreshTrigger={refreshTrigger} // Pass the refresh trigger
            />

            {editingUser && (
                <EditUserForm
                    user={editingUser}
                    show={showEditModal}
                    onUpdateUser={handleUpdateUser}
                    onHide={() => {
                        setEditingUser(null);
                        setEditShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Users;
