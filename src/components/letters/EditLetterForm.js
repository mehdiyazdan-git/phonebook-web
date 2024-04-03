import React from 'react';
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import AsyncSelectInput from "../form/AsyncSelectInput";
import {Col, Modal} from "react-bootstrap";
import {Form} from "../../utils/Form";
import {TextInput} from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import FormRow from "../form/FormRow";
import Button from "../../utils/Button";
import FormContainer from "../../utils/formComponents/FormContainer";
import AttachmentTable from "../attachment/AttachmentTable";
import useHttp from "../../hooks/useHttp";


const headerStyle = {backgroundColor: 'rgba(63,51,106,0.6)',};
const titleStyle = {fontFamily: 'IRANSansBold', fontSize: '0.8rem', color: '#fff',};
const bodyStyle = {backgroundColor: 'rgba(240,240,240,0.3)',};

const EditLetterForm = ({letter, onUpdateLetter, show, onHide,letterType}) => {

    const http = useHttp();
    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const search = async (searchQuery) => {
        return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
    };
    const getCustomerSelect = async () => {
        return await http.get(`/customers/select`);
    };
     const getLetterById = async (id) => {
        return await http.get(`/letters/${id}`).then((response) => response.data);
    };


    const validationSchema = Yup.object().shape({
        letterNumber: Yup.string().required('شماره نامه الزامیست.'),
        creationDate: Yup.date().required('تاریخ نامه الزامیست.'),
        companyId: Yup.string().required('فرستنده الزامیست.'),
        customerId: Yup.string().required('گیرنده الزامیست.'),
        content: Yup.string().required('موضوع نامه الزامیست.'),
    });
    const resolver =  yupResolver(validationSchema);
    const onSubmit =  (data) => {
        onUpdateLetter(data);
        onHide()
    }


    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>{`${letter.companyName} / ویرایش نامه `}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <Form
                    onSubmit={onSubmit}
                    defaultValues={async() => getLetterById(letter.id)}
                    resolver={resolver}>
                    <FormContainer>
                        <div className="mt-1">
                            <FormRow>
                                <Col><TextInput  name="letterNumber" label={"شماره نامه"}/></Col>
                                <Col><DateInput name="creationDate" label="تاریخ نامه:" /></Col>
                            </FormRow>
                            <FormRow>
                                <Col>
                                    <label className="label">{letterType === "outgoing" ? "فرستنده" : "گیرنده"}</label>
                                    <AsyncSelectInput
                                        name={"companyId"}
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
                        <Button variant={"success"} type="submit">بروز رسانی</Button>
                        <Button variant={"warning"} onClick={onHide} type="button">انصراف</Button>
                    </FormContainer>
                </Form>
                <AttachmentTable letterId={letter.id}/>
            </Modal.Body>
        </Modal>
    );
}
export default EditLetterForm;
