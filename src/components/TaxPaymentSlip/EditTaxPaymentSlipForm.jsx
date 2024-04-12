import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Modal, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import SelectInput from "../../utils/formComponents/SelectInput";
import DateInput from "../../utils/formComponents/DateInput";
import NumberInput from "../../utils/formComponents/NumberInput";
import AsyncSelectInput from "../form/AsyncSelectInput";
import useHttp from "../../hooks/useHttp";
import FileComponent from "../file/FileComponent";

const EditTaxPaymentSlipForm = ({ taxPaymentSlip, onUpdateTaxPaymentSlip, show, onHide ,onUploadFile,onFileDelete}) => {
    const http = useHttp();
    const validationSchema = Yup.object().shape({
        issueDate: Yup.date().required('تاریخ صدور الزامیست.'),
        slipNumber: Yup.string().required('شماره فیش الزامیست.'),
        type: Yup.string().required('نوع فیش الزامیست.'),
        amount: Yup.number().required('مبلغ الزامیست.').positive('مبلغ باید مثبت باشد.'),
        period: Yup.string().required('دوره مالی الزامیست.'),
        companyId: Yup.number().required('شناسه شرکت الزامیست.'),
    });
    const resolver = useYupValidationResolver(validationSchema);

    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const onSubmit = (data) => {
        console.log("on form submit: ", data);
        onUpdateTaxPaymentSlip(data);
        onHide();
    };

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={{ backgroundColor: "rgba(63,51,106,0.6)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>ویرایش</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container modal-form">
                    <Form
                        defaultValues={taxPaymentSlip}
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
                                    defaultValue={Number(taxPaymentSlip.companyId)}
                                />
                            </Col>
                        </Row>

                        <Button variant="success" type="submit">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                    <hr/>
                    <FileComponent
                        taxPaymentSlip={taxPaymentSlip}
                        onUploadFile={onUploadFile}
                        onFileDelete={onFileDelete}
                        downloadUrl={`/tax-payment-slips/${taxPaymentSlip.id}/download-file`}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default EditTaxPaymentSlipForm;
