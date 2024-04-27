import React, { useState } from 'react';
import Table from '../table/Table';
import useHttp from '../../hooks/useHttp';
import EditUserForm from "./EditUserForm";
import CreateUserForm from "./CreateUserForm";
import Button from "../../utils/Button";
import Modal from "react-bootstrap/Modal";
import ResetPasswordForm from "./ResetPasswordForm";
import {Alert} from "react-bootstrap";

const Users = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

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

    const handleUpdatePassword = async (userId, newPassword) => {
        try {
            const response = await http.put(`/users/${userId}/reset-password`, { newPassword });
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setShowPasswordResetModal(false);
                setAlert({ show: true, message: 'پسورد با موفقیت تغییر یافت.', variant: "success" });
                setTimeout(() => {setAlert({ show: false, message: "", variant: "" })}, 3000);
            }else {
                setAlert({ show: true, message: 'خطا در بروز رسانی پسورد.', variant: "danger" });
                setTimeout(() => {setAlert({ show: false, message: "", variant: "" })}, 3000);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
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
    const roles =
        {
            'USER': 'کاربر عادی',
            'MANAGER': 'مدیر محتوا',
            'ADMIN': 'مدیر سیستم',
        }
    

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'fullName', title: 'نام کامل', width: '20%', sortable: true, searchable: true,
            render: (item) => `${item.firstname} ${item.lastname}`
        },
        { key: 'email', title: 'ایمیل', width: '20%', sortable: true, searchable: true },
        { key: 'role', title: 'نقش', width: '15%', sortable: true, searchable: true,render : item => roles[item.role] },
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
                onResetPassword={(user) => {
                    setEditingUser(user);
                    setShowPasswordResetModal(true);
                }}
                onDelete={handleDeleteUser}
                refreshTrigger={refreshTrigger} // Pass the refresh trigger
            />

            {editingUser && (
                <>
                    <EditUserForm
                        user={editingUser}
                        show={showEditModal}
                        onUpdateUser={handleUpdateUser}
                        onHide={() => {
                            setEditingUser(null);
                            setEditShowModal(false);
                        }}
                    />
                    <ResetPasswordForm
                        user={editingUser}
                        onUpdatePassword={handleUpdatePassword}
                        show={showPasswordResetModal}
                        onHide={() => {
                            setShowPasswordResetModal(false);
                        }}
                    />
                </>
            )}
            <ErrorModal
                show={showErrorModal}
                handleClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
            {alert.show &&
                <Alert
                    variant={alert.variant}
                    style={{
                        fontFamily:"IRANSans",
                        fontSize: "0.9rem",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        // shadow
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                >
                    {alert.message}
                </Alert>}
        </div>
    );
};

export default Users;
