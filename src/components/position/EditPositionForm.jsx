import React from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { TextInput } from "../../utils/formComponents/TextInput";
import Button from "../../utils/Button";
import {Form} from "../../utils/Form";

const EditPositionForm = ({ position, onUpdatePosition, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('نام پست الزامیست.')
    });
  const resolver = yupResolver(validationSchema);


    const onSubmit = async data => {
        try {
            await  onUpdatePosition(data); // Callback function to update the local state
            onHide(); // Close the modal
        } catch (error) {
            console.error('There was an error updating the position:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>ویرایش پست</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={onSubmit}
                    defaultValues={position}
                    resolver={resolver}
                >
                    <TextInput
                        label="شناسه پست"
                        name={"id"}
                        disabled={true}
                    />
                    <TextInput
                        label="نام پست"
                        name={"name"}
                    />
                    <div className="form-group">
                        <Button type="submit" variant="success">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning">
                            انصراف
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditPositionForm;
