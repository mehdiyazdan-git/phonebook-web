import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from 'react-bootstrap';
import { Form } from '../../utils/Form';
import { TextInput } from '../../utils/formComponents/TextInput';
import Button from '../../utils/Button';

const schema = yup.object({
    name: yup.number()
        .required('نام سال الزامیست.')
        .label('نام سال')
        .min(1000, 'نام سال باید یک عدد 4 رقمی باشد.')
        .max(9999, 'نام سال باید یک عدد 4 رقمی باشد.')
        .transform(v => parseInt(v, 10) || undefined), // Optional type conversion (use with caution)
    startingLetterNumber: yup.number()
        .required('شروع شماره نامه الزامیست.')
        .positive('شروع شماره نامه باید یک عدد مثبت باشد.')
        .integer('شروع شماره نامه باید یک عدد صحیح باشد.'),
});



const CreateYearForm = ({ onAddYear, show, onHide }) => {
    const onSubmit = (data) => {
        onAddYear(data);
        onHide(); // Hide the modal after submitting
    };

    return (
        <Modal size="lg" show={show} onHide={onHide}>
            <Modal.Header style={{ backgroundColor: "rgba(63,51,106,0.6)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>افزودن سال جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    defaultValues={{ name: '' }}
                    onSubmit={onSubmit}
                    resolver={yupResolver(schema)}
                >
                    <TextInput name="name" label="نام سال" />
                    <TextInput name="startingLetterNumber" label="شروع شماره نامه" />

                    <Button variant="primary" type="submit">
                        افزودن سال
                    </Button>
                    <Button onClick={onHide} variant="warning" type="button">
                        انصراف
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateYearForm;
