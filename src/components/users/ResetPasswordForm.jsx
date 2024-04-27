import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from 'react-bootstrap';
import Button from '../../utils/Button';
import { bodyStyle, headerStyle, titleStyle } from "../../settings/styles";
import {Form} from "../../utils/Form";
import {TextInput} from "../../utils/formComponents/TextInput";

// Define the validation schema
const schema = yup.object({
    newPassword: yup.string()
        .required('رمز عبور جدید الزامی است.')
        .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد.'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'رمزهای عبور باید مطابقت داشته باشند.')
        .required('تایید رمز عبور الزامی است.')
}).required();

const resolver = yupResolver(schema);

const ResetPasswordForm = ({ onUpdatePassword, show, onHide,user }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
       await onUpdatePassword(user.id,data.newPassword);
        onHide();
    };

    return (
        <Modal size="lg" show={show} >
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>تغییر رمز عبور</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <Form
                    onSubmit={onSubmit}
                    resolver={resolver}
                >
                    <TextInput
                        name="newPassword"
                        label="رمز عبور جدید"
                        type="password"
                        register={register}
                        error={errors.newPassword}
                    />
                    <TextInput
                        name="confirmPassword"
                        label="تایید رمز عبور"
                        type="password"
                        register={register}
                        error={errors.confirmPassword}
                    />

                    <Button variant="primary" type="submit">
                        تغییر رمز عبور
                    </Button>
                    <Button onClick={onHide} variant="warning" type="button">
                        انصراف
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ResetPasswordForm;
