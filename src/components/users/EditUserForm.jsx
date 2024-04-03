import React, {useEffect, useState} from 'react';
import { Modal } from 'react-bootstrap';
import { Form } from '../../utils/Form';
import { TextInput } from '../../utils/formComponents/TextInput';
import SelectInput from '../../utils/formComponents/SelectInput';
import * as yup from 'yup';
import { useYupValidationResolver } from '../../hooks/useYupValidationResolver';
import Button from "../../utils/Button";
import useHttp from '../../hooks/useHttp';


const schema = yup.object({
    firstname: yup.string().required('نام الزامیست.'),
    lastname: yup.string().required('نام خانوادگی الزامیست.'),
    email: yup.string().email('ایمیل نامعتبر است.').required('ایمیل الزامیست.'),
    password: yup.string().min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد.').required('رمز عبور الزامیست.'),
    role: yup.string().oneOf(['ADMIN', 'MANAGER', 'USER']).required('نقش الزامیست.')
});

const EditUserForm = ({ user, onUpdateUser, show, onHide }) => {
    const [initialValues, setInitialValues]=useState({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        role: user.role.name,
    });
    const resolver = useYupValidationResolver(schema);
    const http = useHttp();



    const onSubmit = (data) => {
        onUpdateUser(data);
        onHide(); // Hide the modal after submitting
    };

    useEffect(() => {
        const getUserById = async (id) => {
            return await http.get(`/users/${id}`).then(response => response.data);
        };
        getUserById(user.id).then(user => setInitialValues(user));
    }, [user]);

    return (
        <Modal size={'lg'} show={show}>
            <Modal.Header style={{ backgroundColor: 'rgba(63,51,106,0.6)' }}>
                <Modal.Title style={{ fontFamily: 'IRANSansBold', fontSize: '0.8rem', color: '#fff' }}>
                    ویرایش
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'rgba(240,240,240,0.3)' }}>
                <div className="container modal-form">
                    <Form defaultValues={initialValues || user} onSubmit={onSubmit} resolver={resolver}>
                        <TextInput name="id" label={'شناسه'} disabled={true} />
                        <TextInput name="firstname" label={'نام'} />
                        <TextInput name="lastname" label={'نام خانوادگی'} />
                        <TextInput name="email" label={'ایمیل'} />
                        <TextInput name="password" label={'رمز عبور'} type="password" />
                        <SelectInput
                            name="role"
                            label="نقش"
                            options={[
                                { value: 'ADMIN', label: 'مدیر' },
                                { value: 'MANAGER', label: 'مدیر محتوا' },
                                { value: 'USER', label: 'کاربر' }
                            ]}
                        />

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
