import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from 'react-bootstrap';
import {Form} from "../../utils/Form";
import {TextInput} from "../../utils/formComponents/TextInput";
import SelectInput from "../../utils/formComponents/SelectInput";
import Button from "../../utils/Button";

const schema = yup.object({
    firstname: yup.string().required('نام الزامیست.'),
    lastname: yup.string().required('نام خانوادگی الزامیست.'),
    email: yup.string().email('ایمیل نامعتبر است.').required('ایمیل الزامیست.'),
    password: yup.string().min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد.').required('رمز عبور الزامیست.'),
    role: yup.string().required('نقش الزامیست.')
});

const CreateUserForm = ({ onAddUser, show, onHide }) => {
    const onSubmit = (data) => {
        onAddUser(data);
        onHide(); // Hide the modal after submitting
    };
    return (
        <Modal size="lg" show={show} onHide={onHide}>
            <Modal.Header style={{ backgroundColor: "rgba(63,51,106,0.6)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>افزودن کاربر جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    defaultValues={{
                        firstname: '',
                        lastname: '',
                        email: '',
                        password: '',
                        role: ''
                    }}
                    onSubmit={onSubmit}
                    resolver={yupResolver(schema)}
                >
                    <TextInput name="firstname" label="نام" />
                    <TextInput name="lastname" label="نام خانوادگی" />
                    <TextInput name="email" label="ایمیل" />
                    <TextInput name="password" label="رمز عبور" type="password" />
                    <SelectInput
                        name="role"
                        label="نقش"
                        options={[
                            { value: 'ADMIN', label: 'مدیر' },
                            { value: 'MANAGER', label: 'مدیر محتوا' },
                            { value: 'USER', label: 'کاربر' }
                        ]}
                    />

                    <Button variant="primary" type="submit">
                        افزودن کاربر
                    </Button>
                    <Button onClick={onHide} variant="warning" type="button">
                        انصراف
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateUserForm;
