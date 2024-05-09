import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {Alert, Modal} from 'react-bootstrap';
import { TextInput } from "../../utils/formComponents/TextInput";
import Button from "../../utils/Button";
import {Form} from "../../utils/Form";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const CreatePositionForm = ({ show, onHide,onAddPosition }) => {
    const [formError, setFormError] = useState('');
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('نام پست الزامیست.')
    });
    const {reset } = useForm();
    const resolver = yupResolver(validationSchema);
    const handleSubmit = async (data) => {
       const message = await onAddPosition(data);
       if (message){
           setFormError(message);
       } else {
           handleClose()
       }
    };
    const handleClose = () => {
        reset();
        setFormError('');
        onHide();
    };

    if (!show) {
        return null;
    }

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
                        <Button onClick={handleClose} variant="warning">
                            انصراف
                        </Button>
                    </div>
                </Form>
                {formError && (
                    <Alert style={{
                        fontFamily: "IRANSans",
                        fontSize: "0.7rem",
                        fontWeight: "bold"
                    }} variant="danger">{formError}</Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CreatePositionForm;
