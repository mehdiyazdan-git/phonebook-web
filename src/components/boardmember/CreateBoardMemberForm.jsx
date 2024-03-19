import React, {useState} from 'react';


import {Form} from "../../utils/Form";
import AsyncSelectInput from "../../utils/formComponents/AsyncSelectInput";
import Company from "../../services/companyService";
import PersonService from "../../services/personService";
import PositionService from "../../services/positionService";
import Button from "../../utils/Button";
import {Modal} from "react-bootstrap";

const CreateBoardMemberForm = ({show,onHide,onAddBoardMember}) => {

    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            await onAddBoardMember(data);
            onHide();
        } catch (error) {
            console.error('Error creating board member:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show}>
            <Modal.Header>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>Create Board Member</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container modal-form">
                    <Form
                        onSubmit={onSubmit}
                    >
                        <div>
                            <label className="label">شرکت</label>
                            <AsyncSelectInput
                                defaultOptions={[]}
                                name={"companyId"}
                                fetchCallBack={Company.crud.getCompanySelect}
                                searchCallback={Company.crud.search}
                            />
                            <label className="label">شخص</label>
                            <AsyncSelectInput
                                defaultOptions={[]}
                                name={"personId"}
                                fetchCallBack={PersonService.crud.getPersonSelect}
                                searchCallback={PersonService.crud.searchPersons}
                            />
                            <label className="label">سمت</label>
                            <AsyncSelectInput
                                defaultOptions={[]}
                                name={"positionId"}
                                fetchCallBack={PositionService.crud.getAllPositions}
                                searchCallback={PositionService.crud.searchPositions}
                            />
                        </div>
                        <div>
                            <Button variant={"primary"} type="submit" disabled={submitting}>
                                ایجاد
                            </Button>
                            <Button variant={"warning"} type="button" disabled={submitting}>
                                انصراف
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateBoardMemberForm;
