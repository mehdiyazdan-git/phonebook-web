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
import { Alert } from 'react-bootstrap';
import useHttp from "../../hooks/useHttp";
import {Form} from "../../utils/Form";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";



const NewLetterForm = ({show, onHide, onAddLetter, companyId,letterType,year}) => {

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
    const getCustomerSelect = async (searchQuery) => {
        return await http.get(`/customers/search?searchQuery=${searchQuery ? searchQuery : ''}`);
    };

    const onSubmit = (data) => {
        onAddLetter(data);
        onHide()
    }


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
                        yearId: Number(sessionStorage.getItem("selectedYear")),
                        letterState: 'DRAFT',
                        letterTypeId: letterType === "incoming" ? 1 : 2
                    }}
                    resolver={resolver}>
                    <FormContainer>
                        <div className="row">
                            <h5 style={{fontFamily: "IRANSansBold", textAlign: "center"}}>ایجاد نامه</h5>
                        </div>
                        <div className="mt-3">
                            <GenerateLetterNumberButton year={year}/>
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
