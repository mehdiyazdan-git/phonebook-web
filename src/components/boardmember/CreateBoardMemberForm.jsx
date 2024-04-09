import React, {useState} from 'react';
import {Form} from "../../utils/Form";
import AsyncSelectInput from "../form/AsyncSelectInput";
import Button from "../../utils/Button";
import { Alert, Modal } from "react-bootstrap";
import useHttp from "../../hooks/useHttp";

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

    const onSubmit = async (data) => {
        setSubmitting(true);
        setFormError('');
        try {
            const errorMessage = await onAddBoardMember(data);
            if (errorMessage) {
                const cleanMessage = errorMessage.replace('400 BAD_REQUEST', '').trim();
                setFormError(cleanMessage);
            } else {
                onHide();
            }
        } catch (error) {
            console.error('Error creating board member:', error);
            setFormError(error.response.data.message.replace('400 BAD_REQUEST', '').trim());
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header style={{ backgroundColor: "rgba(46, 75, 108, 0.8)" }}>
                <Modal.Title
                    style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#ee942d" }}>
                    {`ایجاد عضو جدید `}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
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
