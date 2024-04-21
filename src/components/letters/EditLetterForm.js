import React, {useEffect} from 'react';
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
import useHttp from "../../hooks/useHttp";
import LetterDocumentList from "./LetterDocumentList";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";


// const headerStyle = {backgroundColor: 'rgba(45,92,23,0.49)',};
// const titleStyle = {fontFamily: 'IRANSansBold', fontSize: '0.8rem', color: '#fff',};
// const bodyStyle = {backgroundColor: 'rgba(240,240,240,0.3)',};

const EditLetterForm = ({letter, onUpdateLetter, show, onHide,letterType}) => {

    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    const http = useHttp();
    const findById = async (id)     => {
        return await http.get(`/letters/${id}`).then(r => r.data);
    }

    useEffect(() => {
        if (letter.id) {
            findById(letter.id).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
            });
        }
    }, []);
    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const getCustomerSelect = async () => {
        return await http.get(`/customers/select`)
    };
    const getLetterById = async (id) => {
        return await http.get(`/letters/${id}`).then((response) => {
            // Reverse the letterNumber string
            // letterData.letterNumber = letterData.letterNumber.split('/').reverse().join('/');
            return response.data;
        });
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
                    defaultValues={() => getLetterById(letter.id)}
                    resolver={resolver}>
                    <FormContainer>
                        <div className="mt-1">
                            <FormRow>
                                <Col><TextInput  name="letterNumber" label={"شماره نامه"}/></Col>
                                <Col><TextInput  name="id" label={"شناسه نامه"}/></Col>
                                <Col><DateInput name="creationDate" label="تاریخ نامه:" /></Col>
                            </FormRow>
                            <FormRow>
                                <Col>
                                    <label className="label">{letterType === "outgoing" ? "فرستنده" : "گیرنده"}</label>
                                    <AsyncSelectInput
                                        name={"companyId"}
                                        apiFetchFunction={getCompanySelect}
                                        isDisabled={true}
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
                            <LetterDocumentList letterId={letter.id} onHide={onHide} />
                        </div>
                        <Button variant={"success"} type="submit">بروز رسانی</Button>
                        <Button variant={"warning"} onClick={onHide} type="button">انصراف</Button>
                    </FormContainer>
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
            </Modal.Body>
        </Modal>
    );
}
export default EditLetterForm;
