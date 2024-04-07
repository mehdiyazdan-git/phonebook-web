import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import AsyncSelectInput from "../form/AsyncSelectInput";
import {Col, Modal} from "react-bootstrap";

import {TextInput} from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import FormRow from "../form/FormRow";
import GenerateLetterNumberButton from "./GenerateLetterNumberButton";
import Button from "../../utils/Button";
import FormContainer from "../../utils/formComponents/FormContainer";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import YearService from "../../services/yearServices";
import { Alert } from 'react-bootstrap';
import useHttp from "../../hooks/useHttp";
import {Form} from "../../utils/Form";



const NewLetterForm = ({show, onHide, onAddLetter, companyId,letterType}) => {
    const [years, setYears] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const validationSchema = Yup.object().shape({
        creationDate: Yup.date().required('تاریخ نامه الزامیست.'),
        companyId: Yup.string().required('فرستنده الزامیست.'),
        customerId: Yup.string().required('گیرنده الزامیست.'),
        content: Yup.string().required('موضوع نامه الزامیست.'),
    });
    const resolver = yupResolver(validationSchema);

    const http = useHttp();
    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };
    const getCustomerSelect = async () => {
        return await http.get(`/customers/select`);
    };

    const onSubmit = (data) => {
        onAddLetter(data);
        onHide()
    }

    const headerStyle = {backgroundColor: 'rgba(63,51,106,0.6)',};
    const titleStyle = {fontFamily: 'IRANSansBold', fontSize: '0.8rem', color: '#fff',};
    const bodyStyle = {backgroundColor: 'rgba(240,240,240,0.3)',};

    useEffect(() => {
        const loadYears = async () => {
            return await YearService.crud.getAllYears()
        };
        loadYears().then(response => {
            setYears(response.data);
        })
            .catch(error => {
                console.error('Error fetching years:', error);
            });
    }, []);



    return (
        <Modal size={"lg"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>ایجاد نامه جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <Form
                    onSubmit={onSubmit}
                    defaultValues={{
                        id: '',
                        content: '',
                        creationDate: '',
                        letterNumber: null,
                        customerId: '',
                        companyId: Number(companyId),
                        yearId: getCurrentYear(),
                        letterState: 'DRAFT',
                        letterTypeId: letterType === "incoming" ? 1 : 2
                    }}
                    resolver={resolver}>
                    <FormContainer>
                        <div className="row">
                            <h5 style={{fontFamily: "IRANSansBold", textAlign: "center"}}>ایجاد نامه</h5>
                        </div>
                        <div className="mt-3">
                            <GenerateLetterNumberButton/>
                            <FormRow>
                                <Col><TextInput name="letterNumber" label={"شماره نامه"}/></Col>
                                <Col><DateInput name="creationDate" label="تاریخ نامه:"/></Col>
                            </FormRow>
                            <FormRow>
                                <Col>
                                    <label className="label">{letterType === "outgoing" ? "فرستنده" : "گیرنده"}</label>
                                    <AsyncSelectInput
                                        name="companyId"
                                        apiFetchFunction={getCompanySelect}
                                    />
                                </Col>

                                <Col>
                                    <label className="label">{letterType === "incoming" ? "فرستنده" : "گیرنده"}</label>
                                    <AsyncSelectInput
                                        name={"customerId"}
                                        apiFetchFunction={getCustomerSelect}
                                    />
                                </Col>
                            </FormRow>
                            <FormRow>
                                <Col><TextInput name="content" label="موضوع نامه"/></Col>
                                <Col><TextInput name="companyId" label="شناسه"/></Col>
                            </FormRow>
                        </div>
                        <Button variant={"primary"} type="submit">ایجاد</Button>
                        <Button variant={"warning"} onClick={()=> {
                            setAlertMessage('')
                            onHide();
                        }} type="button">انصراف</Button>
                    </FormContainer>
                </Form>
                {alertMessage && alertMessage.length >0 && <Alert style={{fontFamily:"IRANSans",fontSize:"0.6rem"}} variant="danger">{alertMessage}</Alert>}
            </Modal.Body>
        </Modal>
    );
}
export default NewLetterForm;
