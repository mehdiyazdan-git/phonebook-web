import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from 'react-bootstrap';
import { Form } from '../../utils/Form';
import { TextInput } from '../../utils/formComponents/TextInput';
import Button from '../../utils/Button';

const schema = yup.object({
    name: yup.string().required('نام سال الزامیست.')
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
