import React, {useEffect, useState} from 'react';
import {Alert, Modal} from "react-bootstrap";
import {Form} from "../../utils/Form";
import AsyncSelectInput from "../../utils/formComponents/AsyncSelectInput";
import Button from "../../utils/Button";
import useHttp from "../../hooks/useHttp";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";


const EditBoardMemberForm = ({ boardMember,show,onHide,onUpdateMemberBoard}) => {
    const [formError, setFormError] = useState(''); // State to store form error message
    const http = useHttp();
    const [submitting, setSubmitting] = React.useState(false);
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
    const onSubmit = async (data) => {
        setSubmitting(true);
        setFormError('');
        try {
            const errorMessage = await onUpdateMemberBoard(data);
            if (errorMessage) {
                console.log(errorMessage)
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
    const findById = async (id)=> {
        return await http.get(`/board-members/${id}`).then(r => r.data);
    }
    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    useEffect(() => {
        if (boardMember.id) {
            findById(boardMember?.id).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
            });
        }
    }, []);


    return (
        <Modal show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>فرم ویرایش اعضاء</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        onSubmit={onSubmit}
                        defaultValues={async () => boardMember}
                    >
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
                            <Button variant={"success"} type="submit" disabled={submitting}>
                                ثبت
                            </Button>
                            <Button variant={"warning"} type="button" onClick={onHide} disabled={submitting}>
                                انصراف
                            </Button>
                        </div>
                    </Form>
                    <hr/>
                    <div className="row mt-3 mb-0" style={{
                        fontFamily: 'IRANSans',
                        fontSize: '0.8rem',
                        marginBottom: 0
                    }}>
                        <div className="col">
                            <p>{`ایجاد : ${createByFullName}`} | {` ${createAtJalali}`}</p>
                        </div>
                        <div className="col">
                            <p>{`آخرین ویرایش : ${lastModifiedByFullName}`} | {`${lastModifiedAtJalali}`}</p>
                        </div>
                    </div>
                </div>
                {(formError.length !== 0)
                    && <Alert style={{
                        fontFamily:"IRANSans",
                        fontSize:"0.7rem",
                        fontWeight:"bold"
                    }} variant="danger">{formError}</Alert>}
            </Modal.Body>
        </Modal>
    );
};

export default EditBoardMemberForm;
