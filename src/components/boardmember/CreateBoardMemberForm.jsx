import React, { useState } from 'react';
import { Form } from "../../utils/Form";
import AsyncSelectInput from "../../utils/formComponents/AsyncSelectInput";
import Button from "../../utils/Button";
import { Alert, Modal } from "react-bootstrap";
import useHttp from "../../hooks/useHttp";

const CreateBoardMemberForm = ({ show, onHide, onAddBoardMember }) => {
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const http = useHttp();

    const searchCompany = async (searchQuery) => {
        return await http.get(`/companies/search?searchQuery=${searchQuery}`).then(response => response.data);
    };
    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`).then(response => response.data);
    };
    const getPersonSelect = async () => {
        return await http.get(`/persons/select`).then(r => r.data);
    };
    const searchPersons = async (searchQuery) => {
        return await http.get(`/persons/search?searchQuery=${searchQuery}`).then(response => response.data);
    };
    const getAllPositions = async () => {
        return await http.get("/positions/select").then(response => response.data);
    };
    const searchPositions = async (searchQuery) => {
        return await http.get(`/positions/search?searchQuery=${searchQuery}`).then(response => response.data);
    };

    const handleClose = () => {
        onHide();
        setFormError('');
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
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>Create Board Member</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container modal-form">
                    <Form onSubmit={onSubmit}>
                        <div>
                            <label className="label">شرکت</label>
                            <AsyncSelectInput
                                defaultOptions={[]}
                                name={"companyId"}
                                fetchCallBack={getCompanySelect}
                                searchCallback={searchCompany}
                            />
                            <label className="label">شخص</label>
                            <AsyncSelectInput
                                defaultOptions={[]}
                                name={"personId"}
                                fetchCallBack={getPersonSelect}
                                searchCallback={searchPersons}
                            />
                            <label className="label">سمت</label>
                            <AsyncSelectInput
                                defaultOptions={[]}
                                name={"positionId"}
                                fetchCallBack={getAllPositions}
                                searchCallback={searchPositions}
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
