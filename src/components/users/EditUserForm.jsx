import React from 'react';
import {Col, Modal, Row} from 'react-bootstrap';
import { Form } from '../../utils/Form';
import { TextInput } from '../../utils/formComponents/TextInput';
import SelectInput from '../../utils/formComponents/SelectInput';
import * as yup from 'yup';
import { useYupValidationResolver } from '../../hooks/useYupValidationResolver';
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

const EditUserForm = ({ user, onUpdateUser, show, onHide }) => {

    const resolver = useYupValidationResolver(schema);

    const onSubmit = (data) => {
        console.log('data', data)
        onUpdateUser(data);
        onHide(); // Hide the modal after submitting
    };


    return (
        <Modal size={'lg'} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>
                    ویرایش
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={user}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    ><Row>
                        <Col><TextInput name="firstname" label="نام" /></Col>
                        <Col><TextInput name="lastname" label="نام خانوادگی" /></Col>
                    </Row>
                        <Row>
                            <Col><TextInput name="username" label="نام کاربری" /></Col>
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
                        <hr/>
                        <Button variant="success" type="submit">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserForm;
