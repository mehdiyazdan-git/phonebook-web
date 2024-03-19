import React from 'react';
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import AsyncSelectInput from "../form/AsyncSelectInput";
import {Col, Modal} from "react-bootstrap";
import {Form} from "../../utils/Form";
import {TextInput} from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import FormRow from "../form/FormRow";
import GenerateLetterNumberButton from "./GenerateLetterNumberButton";
import Button from "../../utils/Button";
import FormContainer from "../../utils/formComponents/FormContainer";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import Customer from "../../services/CustomerService";
import Company from "../../services/companyService";


const NewLetterForm = ({show, onHide, onAddLetter, companyId}) => {

    const validationSchema = Yup.object().shape({
        letterNumber: Yup.string().required('شماره نامه الزامیست.'),
        creationDate: Yup.date().required('تاریخ نامه الزامیست.'),
        companyId: Yup.string().required('فرستنده الزامیست.'),
        customerId: Yup.string().required('گیرنده الزامیست.'),
        content: Yup.string().required('موضوع نامه الزامیست.'),
    });
    const resolver = yupResolver(validationSchema);

    const onSubmit = (data) => {
        onAddLetter(data);
        onHide()
    }

    const headerStyle = {backgroundColor: 'rgba(63,51,106,0.6)',};
    const titleStyle = {fontFamily: 'IRANSansBold', fontSize: '0.8rem', color: '#fff',};
    const bodyStyle = {backgroundColor: 'rgba(240,240,240,0.3)',};

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
                                    <label className="label">فرستنده</label>
                                    <AsyncSelectInput
                                        name="companyId"
                                        apiFetchFunction={Company.crud.getCompanySelect}
                                    />
                                </Col>
                                <Col>
                                    <label className="label">گیرنده</label>
                                    <AsyncSelectInput
                                        name={"customerId"}
                                        apiFetchFunction={Customer.crud.getCustomerSelect}
                                    />
                                </Col>
                            </FormRow>
                            <FormRow>
                                <Col><TextInput name="content" label="موضوع نامه"/></Col>
                                <Col><TextInput name="companyId" label="شناسه"/></Col>
                            </FormRow>
                        </div>
                        <Button variant={"primary"} type="submit">ایجاد</Button>
                        <Button variant={"warning"} onClick={onHide} type="button">انصراف</Button>
                    </FormContainer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
export default NewLetterForm;
