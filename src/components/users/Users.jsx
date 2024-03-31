import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import EditUserForm from './EditUserForm';
import useHttp from "../../hooks/useHttp";
import useDeepCompareEffect from '../hooks/useDeepCompareEffect';
import Pagination from '../pagination/Pagination';
import './user.css';
import CreateUserForm from './CreateUserForm';

const Users = () => {
    const http = useHttp();
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [search, setSearch] = useState({ firstname: '', lastname: '', email: '' });
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage,setSuccessMessage] = useState('');

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useDeepCompareEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                size: pageSize.toString(),
                sortBy: sortBy,
                order: sortOrder,
                ...search,
            });
            return await http.get(`/users?${queryParams.toString()}`);
        };
        fetchData()
            .then((response) => {
                if (response.status === 200) {
                    setUsers(response.data.content);
                    setTotalPages(response.data.totalPages);
                    setTotalElements(response.data.totalElements);
                } else {
                    setUsers([]);
                }
            })
            .catch(() => setUsers([]));
    }, [http, currentPage, pageSize, sortBy, sortOrder, search]);

    const handleAddUser = async (newUser) => {
        const response = await http.post('/users', newUser);
        setUsers([...users, response.data]);
    };

    const handleUpdateUser = async (updatedUser) => {
        const response = await http.put(`/users/${updatedUser.id}`, updatedUser);
        setUsers(users.map(user => user.id === updatedUser.id ? response.data : user));
        setEditingUser(null);
    };

    const handleDeleteUser = async () => {
        try {
            const response = await http.delete(`/users/${userToDelete}`);
            if (response.status === 204) {
                setUsers(users.filter(user => user.id !== userToDelete));
                setSuccessMessage("user deleted successfully")
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrorMessage('User cannot be deleted because it has associated entities');
            } else {
                setErrorMessage('An error occurred while deleting the user');
            }
        }finally {
            setShowConfirmModal(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
    };

    return (
        <div className="table-container">
            <h2>Users List</h2>

            {errorMessage && <Alert  variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add New User
                </Button>
                <CreateUserForm
                    onAddUser={handleAddUser}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
            <table className="user-table mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            <Button size="sm" variant="success" onClick={() => {
                                setEditingUser(user);
                                setEditShowModal(true);
                            }}>Edit</Button>
                            <Button size="sm" variant="danger" onClick={() => {
                                setUserToDelete(user.id);
                                setShowConfirmModal(true);
                            }}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalElements}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
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

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Users;
