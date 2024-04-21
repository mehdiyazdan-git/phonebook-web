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
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const CreateTaxPaymentSlipForm = ({ onAddTaxPaymentSlip, show, onHide, companyId }) => {
    const validationSchema = Yup.object().shape({
        issueDate: Yup.date().required('تاریخ صدور الزامیست.'),
        slipNumber: Yup.string().required('شماره فیش الزامیست.'),
        type: Yup.string().required('نوع فیش الزامیست.'),
        amount: Yup.number().required('مبلغ الزامیست.').positive('مبلغ باید مثبت باشد.'),
        period: Yup.string().required('دوره مالی الزامیست.'),
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
            period: '',
            companyId: Number(companyId),
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        console.log("on form submit: ", data);
        onAddTaxPaymentSlip(data);
        reset({
            id: '',
            issueDate: '',
            slipNumber: '',
            type: '',
            amount: '',
            period: '',
            companyId: '',
        });
        onHide();
    };
    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}  className="glass-effect">
                <div className="container modal-form">
                    <Form
                        defaultValues={{
                            id: '',
                            issueDate: new Date(),
                            slipNumber: '',
                            type: '',
                            amount: '',
                            period: '',
                            companyId: Number(companyId),
                        }}
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
                                    label={"نوع فیش"}
                                    options={[
                                        { value: 'CORPORATE_INCOME_TAX', label: 'فیش پرداخت مالیات عملکرد اشخاص حقوقی' },
                                        { value: 'PAYROLL_TAX', label: 'فیش پرداخت مالیات بر حقوق' },
                                        { value: 'VALUE_ADDED_TAX', label: 'فیش پرداخت مالیات بر ارزش افزوده' },
                                        { value: 'QUARTERLY_TRANSACTIONS', label: 'فیش پرداخت معاملات فصلی' },
                                        { value: 'PROPERTY_RENT_TAX', label: 'فیش پرداخت مالیات اجاره املاک' },
                                        { value: 'PROPERTY_TRANSFER_TAX', label: 'فیش پرداخت مالیات نقل و انتقال املاک' },
                                        { value: 'OTHER_FEES_AND_CHARGES', label: 'فیش پرداخت سایر عوارض و وجوه' }
                                    ]}
                                />

                            </Col>
                            <Col>
                                <NumberInput name="amount" label={"مبلغ"} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="period" label={"دوره مالی"} />
                            </Col>
                            <Col>
                                <label>{"شرکت"}</label>
                                <AsyncSelectInput
                                    name={"companyId"}
                                    apiFetchFunction={getCompanySelect}
                                    defaultValue={Number(companyId)}
                                    isDisabled={true}
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

export default CreateTaxPaymentSlipForm;
