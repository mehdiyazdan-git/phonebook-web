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
import DateInput from "../../utils/formComponents/DateInput";

const CreateInsuranceSlipForm = ({ insuranceSlip, onAddInsuranceSlip, show, onHide, companyId }) => {
    const validationSchema = Yup.object().shape({
        issueDate: Yup.date().required('تاریخ صدور الزامیست.'),
        slipNumber: Yup.string().required('شماره فیش الزامیست.'),
        type: Yup.string().required('نوع الزامیست.'),
        amount: Yup.number().required('مبلغ الزامیست.').positive('مبلغ باید مثبت باشد.'),
        startDate: Yup.date().required('تاریخ شروع الزامیست.'),
        endDate: Yup.date().required('تاریخ پایان الزامیست.'),
        companyId: Yup.number().required('شناسه شرکت الزامیست.'),
    });
    const http = useHttp();

    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const resolver = useYupValidationResolver(validationSchema);
    const { reset } = useForm({
        defaultValues: {
            id: '',
            issueDate: '',
            slipNumber: '',
            type: '',
            amount: '',
            startDate: '',
            endDate: '',
            companyId: Number(companyId),
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        console.log("on form submit: ", data);
        onAddInsuranceSlip(data);
        reset({
            id: '',
            issueDate: '',
            slipNumber: '',
            type: '',
            amount: '',
            startDate: '',
            endDate: '',
            companyId: '',
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
                                <DateInput name="issueDate" label={"تاریخ صدور"} />
                            </Col>
                            <Col>
                                <TextInput name="slipNumber" label={"شماره فیش"} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <SelectInput
                                    name="type"
                                    label={"نوع"}
                                    options={[
                                        { value: 'INSURANCE_PREMIUM', label: 'حق بیمه' },
                                        { value: 'PENALTY', label: 'جریمه' }
                                    ]}
                                />

                            </Col>
                            <Col>
                                <NumberInput name="amount" label={"مبلغ"} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DateInput name="startDate" label={"تاریخ شروع"} />
                            </Col>
                            <Col>
                                <DateInput name="endDate" label={"تاریخ پایان"} />
                            </Col>
                        </Row>
                        <Row>
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
