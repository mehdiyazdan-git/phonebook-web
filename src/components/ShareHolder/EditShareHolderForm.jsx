import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Modal, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import SelectInput from "../../utils/formComponents/SelectInput";
import NumberInput from "../../utils/formComponents/NumberInput";
import AsyncSelectInput from "../form/AsyncSelectInput";
import useHttp from "../../hooks/useHttp";
import FileComponent from "../file/FileComponent";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const EditShareHolderForm = ({ shareholder, onUpdateShareHolder, show, onHide, onUploadFile, onFileDelete }) => {
    const validationSchema = Yup.object().shape({
        personId: Yup.number().required('شناسه شخص الزامیست.'),
        numberOfShares: Yup.number()
            .typeError('تعداد سهام باید مقدار عددی باشد')
            .required('تعداد سهام الزامیست.')
            .positive('تعداد سهام باید مثبت باشد.')
            .lessThan(2147483647,'تعداد سهام نمیتواند بیشتر از 2,147,483,647 باشد.'),
        percentageOwnership: Yup.number()
            .typeError('درصد مالکیت باید مقدار عددی باشد')
            .required('درصد مالکیت الزامیست.')
            .moreThan(0, 'درصد مالکیت باید بیشتر از صفر باشد.')
            .max(100, 'درصد مالکیت نمی‌تواند بیشتر از ۱۰۰ باشد.'),
        sharePrice: Yup.number()
            .required('قیمت سهم الزامیست.')
            .positive('قیمت سهم باید مثبت باشد.')
            .lessThan(99999999.99,'قیمت سهم نمیتواند بیشتر از 99,999,999/99 باشد.'),
        shareType: Yup.string().required('نوع سهم الزامیست.'),
        companyId: Yup.number().required('شناسه شرکت الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const http = useHttp();

    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    const findById = async (id)     => {
        return await http.get(`/shareholders/${id}`).then(r => r.data);
    }

    useEffect(() => {
        if (shareholder.id) {
            findById(shareholder.id).then(r => {
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
    const getPersonSelect = async () => {
        return await http.get(`/persons/select`);
    };

    const onSubmit = (data) => {
        console.log("on form submit: ", data);
        onUpdateShareHolder(data);
        onHide();
    };

    useEffect(() => {
        console.log("on form pop-up: ", shareholder);
    });

    const defaultValues = {
        id: shareholder.id,
        personId: shareholder.personId,
        numberOfShares: shareholder.numberOfShares,
        percentageOwnership: shareholder.percentageOwnership,
        sharePrice: shareholder.sharePrice,
        shareType: shareholder.shareType,
        companyId: shareholder.companyId,
    }

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>ویرایش</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <label>{"شرکت"}</label>
                                <AsyncSelectInput
                                    name={"companyId"}
                                    apiFetchFunction={getCompanySelect}
                                    defaultValue={Number(shareholder.companyId)}
                                    isDisabled={true}
                                />
                            </Col>

                            <Col>
                                <label>{"سهامدار"}</label>
                                <AsyncSelectInput
                                    name={"personId"}
                                    apiFetchFunction={getPersonSelect}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <NumberInput name="numberOfShares" label={"تعداد سهام"}/>
                            </Col>
                            <Col>
                                <NumberInput name="sharePrice" label={"قیمت سهم"}/>
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="percentageOwnership" label={"درصد مالکیت"}/>
                            </Col>
                            <Col>
                                <SelectInput
                                    name="shareType"
                                    label={"نوع سهم"}
                                    options={
                                    [
                                        {value: 'REGISTERED', label: 'با نام'},
                                        {value: 'BEARER', label: 'بی نام'}
                                    ]}
                                />
                            </Col>
                        </Row>
                        {/*<Row>*/}
                        {/*    <Col>*/}
                        {/*        <TextInput name="id" label={"شناسه"} disabled={true}/>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}


                        <Button variant="success" type="submit">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                    <hr/>
                    <FileComponent
                        taxPaymentSlip={shareholder}
                        onUploadFile={onUploadFile}
                        onFileDelete={onFileDelete}
                        downloadUrl={`/shareholders/${shareholder.id}/download-file`}
                    />
                </div>
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

export default EditShareHolderForm;
