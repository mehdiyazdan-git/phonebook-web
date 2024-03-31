import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal, Button } from 'react-bootstrap';

const schema = yup.object({
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: yup.string().oneOf(['ADMIN', 'MANAGER', 'USER']).required('Role is required')
}).required();

const CreateUserForm = ({ onAddUser, show, onHide }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        onAddUser(data);
        reset();
        onHide(); // Hide the modal after submitting
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">First Name:</label>
                        <input type="text" className={`form-control ${errors.firstname ? 'is-invalid' : ''}`} {...register('firstname')} />
                        {errors.firstname && <div className="invalid-feedback">{errors.firstname.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name:</label>
                        <input type="text" className={`form-control ${errors.lastname ? 'is-invalid' : ''}`} {...register('lastname')} />
                        {errors.lastname && <div className="invalid-feedback">{errors.lastname.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email')} />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} {...register('password')} />
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Role:</label>
                        <select className={`form-control ${errors.role ? 'is-invalid' : ''}`} {...register('role')}>
                            <option value="">Select a role</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="USER">USER</option>
                        </select>
                        {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
                    </div>

                    <Button variant="primary" type="submit">
                        Add User
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateUserForm;
