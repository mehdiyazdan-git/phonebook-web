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
import PersonPositions from "./PersonPostions";
import useHttp from "../../hooks/useHttp";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";


const EditPersonForm = ({ person, onUpdatePerson, show, onHide }) => {
    const [refreshDocumentList, setRefreshDocumentList] = useState(false);
    const [activeTab, setActiveTab] = useState(
        sessionStorage.getItem(`editPerson`) || "editPerson"
    );

    const http = useHttp();

    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    const findById = async (id) => {
        try {
            const response = await http.get(`/persons/${id}`);
            return response.data;
        } catch (error) {
            console.error('An error occurred while fetching person data:', error);
            // Optionally, handle specific error status codes, e.g., redirect if 403
            if (error.response && error.response.status === 403) {
                // Redirect or display an error message to the user
                onHide(); // Close the modal if needed
            }
            return null; // Return null or appropriate fallback data
        }
    }

    useEffect(() => {
        if (person.id) {
            findById(person.id).then(r => {
                if (r) { // Make sure response data is not null
                    setCreateAtJalali(r.createAtJalali)
                    setLastModifiedAtJalali(r.lastModifiedAtJalali)
                    setCreateByFullName(r.createByFullName)
                    setLastModifiedByFullName(r.lastModifiedByFullName)
                }
            }).catch(error => {
                // Handle errors from findById or the .then() block if not caught
                console.error('An error occurred in useEffect while fetching person:', error);
                onHide(); // Optionally close the modal
            });
        }
    }, [person.id]); // Add person.id as a dependency

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
        if (data.birthDate){
            data.birthDate = moment(new Date(data.birthDate)).format('YYYY-MM-DD');
        }

        console.log("on form submit: ", data);
        onUpdatePerson(data);
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
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>
                    {person?.firstName} {person?.lastName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <TabContainer>
                    <Tab isActive={activeTab === 'editPerson'} onClick={() => setActiveTab('editPerson')}>
                        مشخصات
                    </Tab>
                    <Tab isActive={activeTab === 'editPersonDocuments'}
                         onClick={() => setActiveTab('editPersonDocuments')}>
                        مدارک
                    </Tab>
                    <Tab isActive={activeTab === 'personPositions'} onClick={() => setActiveTab('personPositions')}>
                        سمت ها
                    </Tab>
                </TabContainer>
                {activeTab === 'editPerson' && (
                    <div className="container modal-body"
                         style={{fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0"}}>
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
                            <DocumentList personId={Number(person.id)} onHide={onHide}/>
                        </Col>
                    </Row>
                )}
                {activeTab === 'personPositions' && (
                    <Row className={"border border-1 rounded-2 m-2 p-2"}>
                        <Col>
                            <PersonPositions personId={Number(person.id)} onHide={onHide}/>
                        </Col>
                    </Row>
                )}
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
            </Modal.Body>
        </Modal>
    );
};

export default EditPersonForm;
