import React, {useState} from 'react';
import {Form} from "../../utils/Form";
import AsyncSelectInput from "../form/AsyncSelectInput";
import Button from "../../utils/Button";
import { Alert, Modal } from "react-bootstrap";
import useHttp from "../../hooks/useHttp";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";


const CreateBoardMemberForm = ({ show, onHide, onAddBoardMember,companyId }) => {
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const http = useHttp();
    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam.toString() : ''}`);
    };
    const getPersonSelect = async (queryParam) => {
        return await http.get(`/persons/select?queryParam=${queryParam ? queryParam.toString() : ''}`)  ;
    };
    const getAllPositions = async (queryParam) => {
        return await http.get(`/positions/select?queryParam=${queryParam ? queryParam.toString() : ''}`)
    };


    const handleClose = () => {
        setFormError('');
        setSubmitting(false);
        onHide();

    };

    const onSubmit =   async (data) => {
        setSubmitting(true);
        setFormError('');
       const message = await onAddBoardMember(data);
       if (message) {
           setFormError(message);
           setSubmitting(false);
       }else {
           setSubmitting(false)
           handleClose();
       }
       setSubmitting(false);
    };



    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header style={headerStyle}>
                <Modal.Title
                    style={titleStyle}>
                    {`ایجاد عضو جدید `}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        onSubmit={onSubmit}
                        defaultValues={{
                            "personId": '',
                            "companyId": companyId,
                            "positionId": ''
                        }}
                    >
                        <div>
                            <label className="label">شرکت</label>
                            <AsyncSelectInput
                                name={"companyId"}
                                apiFetchFunction={getCompanySelect}
                                isDisabled={true}
                            />
                            <label className="label">شخص</label>
                            <AsyncSelectInput
                                name={"personId"}
                                apiFetchFunction={getPersonSelect}
                            />
                            <label className="label">سمت</label>
                            <AsyncSelectInput
                                name={"positionId"}
                                apiFetchFunction={getAllPositions}
                            />
                        </div>
                        <div>
                            <Button variant={"primary"} type="submit" disabled={submitting}>
                                ایجاد
                            </Button>
                            <Button onClick={handleClose} variant={"warning"} type="button" disabled={submitting}>
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
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateBoardMemberForm;
