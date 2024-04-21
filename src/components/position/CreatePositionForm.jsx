import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {Modal} from 'react-bootstrap';
import { TextInput } from "../../utils/formComponents/TextInput";
import Button from "../../utils/Button";
import {Form} from "../../utils/Form";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const CreatePositionForm = ({ show, onHide,onAddPosition }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('نام پست الزامیست.')
    });
    const {reset } = useForm();
    const resolver = yupResolver(validationSchema);
    const handleSubmit = async (data) => {
        onAddPosition(data);
        reset(); // Clear the form
        onHide(); // Close the modal
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header style={ headerStyle }>
                <Modal.Title style={titleStyle}>ایجاد پست جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
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
                        <Button onClick={onHide} variant="warning">
                            انصراف
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreatePositionForm;
