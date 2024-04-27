import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Col, Modal, Row} from 'react-bootstrap';
import {Form} from "../../utils/Form";
import {TextInput} from "../../utils/formComponents/TextInput";
import SelectInput from "../../utils/formComponents/SelectInput";
import Button from "../../utils/Button";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";
import CheckboxInput from "../../utils/formComponents/CheckboxInput";

const schema = yup.object({
    firstname: yup.string().required('نام الزامیست.'),
    lastname: yup.string().required('نام خانوادگی الزامیست.'),
    username: yup.string()
        .min(3, 'نام کاربری باید حداقل 3 کاراکتر باشد.')
        .max(20, 'نام کاربری می تواند حداکثر 20 کاراکتر باشد.')
        .required('نام کاربری الزامیست.'),
    email: yup.string().email('ایمیل نامعتبر است.'),
    password: yup.string().min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد.').required('رمز عبور الزامیست.'),
    role: yup.string().required('نقش الزامیست.')
});


const CreateUserForm = ({ onAddUser, show, onHide }) => {
    const onSubmit = (data) => {
        onAddUser(data);
        onHide(); // Hide the modal after submitting
    };
    return (
        <Modal size="lg" show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>افزودن کاربر جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <Form
                    defaultValues={{
                        id: '',
                        firstname: '',
                        lastname: '',
                        username: '',
                        email: '',
                        password: '',
                        role: 'USER',
                        accountNonExpired: true,
                        credentialsNonExpired: true,
                        accountNonLocked: true,
                        enabled: true,
                    }}
                    onSubmit={onSubmit}
                    resolver={yupResolver(schema)}
                >
                   <Row>
                       <Col><TextInput name="firstname" label="نام" /></Col>
                      <Col><TextInput name="lastname" label="نام خانوادگی" /></Col>
                   </Row>
                    <Row>
                        <Col><TextInput name="username" label="نام کاربری" /></Col>
                        <Col><TextInput name="password" label="رمز عبور" type="password" /></Col>
                    </Row>
                    <Row>
                        <Col><TextInput name="email" label="ایمیل" /></Col>
                        <Col><SelectInput
                            name="role"
                            label="نقش"
                            options={[
                                { value: 'ADMIN', label: 'مدیر سیستم' },
                                { value: 'MANAGER', label: 'مدیر محتوا' },
                                { value: 'USER', label: 'کاربر' }
                            ]}
                        /></Col>
                    </Row>
                    <CheckboxInput name="enabled" label="فعال" />
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
