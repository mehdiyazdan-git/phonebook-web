import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Modal, Row } from 'react-bootstrap';
import { Form } from "../../utils/Form";
import { TextInput } from "../../utils/formComponents/TextInput";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import Button from "../../utils/Button";
import SelectInput from "../../utils/formComponents/SelectInput";
import useHttp from "../../hooks/useHttp";
import AsyncSelectInput from "../form/AsyncSelectInput";
import NumberInput from "../../utils/formComponents/NumberInput";

const CreateInsuranceSlipForm = ({ insuranceSlip, onAddInsuranceSlip, show, onHide, companyId }) => {
    const validationSchema = Yup.object().shape({
        personId: Yup.number().required('شناسه شخص الزامیست.'),
        numberOfShares: Yup.number().required('تعداد سهام الزامیست.').positive('تعداد سهام باید مثبت باشد.'),
        percentageOwnership: Yup.number().required('درصد مالکیت الزامیست.').min(0, 'درصد مالکیت نمی‌تواند منفی باشد.').max(100, 'درصد مالکیت نمی‌تواند بیشتر از ۱۰۰ باشد.'),
        sharePrice: Yup.number().required('قیمت سهم الزامیست.').positive('قیمت سهم باید مثبت باشد.'),
        shareType: Yup.string().required('نوع سهم الزامیست.'),
        companyId: Yup.number().required('شناسه شرکت الزامیست.'),
    });
    const http = useHttp();

    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };
    const getPersonSelect = async () => {
        return await http.get(`/persons/select`);
    };

    const resolver = useYupValidationResolver(validationSchema);
    const { reset } = useForm({
        defaultValues: {
            id: '',
            personId: '',
            numberOfShares: '',
            percentageOwnership: '',
            sharePrice: '',
            shareType: '',
            companyId: Number(companyId),
            scannedShareCertificate: '',
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        console.log("on form submit: ", data);
        onAddInsuranceSlip(data);
        reset({
            id: '',
            personId: '',
            numberOfShares: '',
            percentageOwnership: '',
            sharePrice: '',
            shareType: '',
            companyId: '',
            scannedShareCertificate: '',
        });
        onHide();
    };
    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={{ backgroundColor: "rgba(46, 75, 108, 0.8)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container modal-form">
                    <Form
                        defaultValues={insuranceSlip}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <label>{"بیمه‌گزار"}</label>
                                <AsyncSelectInput
                                    name={"personId"}
                                    apiFetchFunction={getPersonSelect}
                                />
                            </Col>
                            <Col>
                                <NumberInput name="numberOfShares" label={"تعداد سهام"} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="percentageOwnership" label={"درصد مالکیت"} />
                            </Col>
                            <Col>
                                <NumberInput name="sharePrice" label={"قیمت سهم"} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <SelectInput name="shareType" label={"نوع سهم"} options={[{ value: 'REGISTERED', label: 'ثبت شده' }, { value: 'BEARER', label: 'حامل' }]} />
                            </Col>
                            <Col>
                                <label>{"شرکت"}</label>
                                <AsyncSelectInput
                                    name={"companyId"}
                                    apiFetchFunction={getCompanySelect}
                                    defaultValue={Number(companyId)}
                                />
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            ایجاد
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default CreateInsuranceSlipForm;
