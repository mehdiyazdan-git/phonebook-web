import React, { useState } from 'react';
import Table from '../table/Table';
import useHttp from '../../hooks/useHttp';
import EditUserForm from "./EditUserForm";
import CreateUserForm from "./CreateUserForm";
import Button from "../../utils/Button";
import Modal from "react-bootstrap/Modal";

const Users = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

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
        try {
            const response = await createUser(newUser);
            if (response.status === 201) {
                setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
                setShowModal(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    };

    const handleUpdateUser = async (updatedUser) => { // Function name updated
        try {
            const response = await updateUser(updatedUser.id, updatedUser);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
                setEditingUser(null);
                setEditShowModal(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
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



    return (
        <div className="table-container">
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
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
            <ErrorModal
                show={showErrorModal}
                handleClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Users;
