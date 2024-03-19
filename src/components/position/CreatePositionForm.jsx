import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from 'react-bootstrap';
import { TextInput } from "../../utils/formComponents/TextInput";
import Button from "../../utils/Button";
import {Form} from "../../utils/Form";



const CreatePositionForm = ({ show, onHide,onAddPosition }) => {

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('نام پست الزامیست.')
    });
    const {reset } = useForm();
    const resolver = yupResolver(validationSchema);
    const handleSubmit = async data => {
        try {
           await onAddPosition(data);
            reset(); // Clear the form
            onHide(); // Close the modal
        } catch (error) {
            console.error('There was an error creating the position:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>ایجاد پست جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    resolver={resolver}
                >
                    <TextInput
                        label="نام پست"
                        name={"name"}
                    />
                    <div className="form-group">
                        <Button type="submit" variant="primary">
                            ایجاد
                        </Button>
                        <Button onClick={onHide} variant="secondary">
                            انصراف
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreatePositionForm;
