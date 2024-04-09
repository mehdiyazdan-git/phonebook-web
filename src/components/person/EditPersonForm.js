import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Modal, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import {verifyIranianNationalId} from "@persian-tools/persian-tools";
import {NationalIdInput} from "../../utils/formComponents/NationalIdInput";
import {PhoneNumberInput} from "../../utils/formComponents/PhoneNumberInput";
import DocumentList from "./document/DocumentList";
import {TabContainer} from "../tabs/TabContainer";
import {Tab} from "../tabs/Tab";


const EditPersonForm = ({ person, onUpdatePerson, show, onHide }) => {
    const [refreshDocumentList, setRefreshDocumentList] = useState(false);
    const [activeTab, setActiveTab] = useState(
        sessionStorage.getItem(`editPerson`) || "editPerson"
    );

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('نام الزامیست.'),
        lastName: Yup.string().required('نام خانوادگی الزامیست.'),
        nationalId: Yup.string()
            .required('کد ملی الزامیست.')
            .test(
                'is-valid-national-id',
                'کد ملی نامعتبر است.',
                value => verifyIranianNationalId(value)
            ),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = (data) => {
        const formattedDate = moment(new Date(data.birthDate)).format('YYYY-MM-DD');
        const formData = {
            ...data,
            birthDate: formattedDate
        }
        console.log("on form submit: ", formData);
        onUpdatePerson(formData);
        onHide();
    };

    useEffect(() => {
        console.log("on form pop-up: ", person);
    });
    const handleUploadSuccess = () => {
        setRefreshDocumentList(prevState => !prevState);
    };

    return (
        <Modal size={"xl"} show={show}>
            <Modal.Header style={{ backgroundColor: "rgba(63,51,106,0.6)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>
                    {person?.firstName} {person?.lastName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <TabContainer>
                    <Tab isActive={activeTab === 'editPerson'} onClick={() => setActiveTab('editPerson')}>
                        مشخصات
                    </Tab>
                    <Tab isActive={activeTab === 'editPersonDocuments'} onClick={() => setActiveTab('editPersonDocuments')}>
                        مدارک
                    </Tab>
                </TabContainer>
                {activeTab === 'editPerson' && (
                    <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem",margin:"0" }}>
                        <Form
                            defaultValues={person}
                            onSubmit={onSubmit}
                            resolver={resolver}
                        >
                            <Row>
                                <Col>
                                    <TextInput name="firstName" label={"نام"}/>
                                    <TextInput name="lastName" label={"نام خانوادگی"}/>
                                    <TextInput name="fatherName" label={"نام پدر"}/>
                                    <NationalIdInput name="nationalId" label={"کد ملی"}/>
                                </Col>
                                <Col>
                                    <TextInput name="registrationNumber" label={"شماره شناسنامه"}/>
                                    <TextInput name="postalCode" label={"کد پستی"}/>
                                    <DateInput name="birthDate" label={"تاریخ تولد"}/>
                                    <PhoneNumberInput name="phoneNumber" label={"شماره تماس"}/>
                                </Col>
                            </Row>
                            <Row>
                                <TextInput name="address" label={"آدرس"}/>
                            </Row>

                            <Button variant="success" type="submit">
                                ویرایش
                            </Button>
                            <Button onClick={onHide} variant="warning" type="button">
                                انصراف
                            </Button>
                        </Form>
                    </div>
                )}
                {activeTab === 'editPersonDocuments' && (
                    <Row className={"border border-1 rounded-2 m-2 p-2"}>
                        <Col>
                            <DocumentList personId={Number(person.id)} onHide={onHide} />
                        </Col>
                    </Row>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditPersonForm;
