import React from 'react';
import {Modal} from "react-bootstrap";
import {Form} from "../../utils/Form";
import AsyncSelectInput from "../../utils/formComponents/AsyncSelectInput";
import Button from "../../utils/Button";
import useHttp from "../../hooks/useHttp";


const EditBoardMemberForm = ({ boardMember,show,onHide,onUpdateMemberBoard}) => {
    const http = useHttp();
    console.log(boardMember)
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
        return await http.get("/positions").then(response => response.data);
    };
    const searchPositions = async (searchQuery) => {
        return await http.get(`/positions/search?searchQuery=${searchQuery}`).then(response => response.data);
    };
    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
           await onUpdateMemberBoard(data);
            onHide();
            console.log(data)
        } catch (error) {
            console.error('Error updating board member:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show}>
            <Modal.Header>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>فرم ویرایش اعضاء</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
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
                            <Button variant={"success"} type="submit">
                                ثبت
                            </Button>
                            <Button variant={"warning"} type="button" onClick={onHide}>
                                انصراف
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditBoardMemberForm;
