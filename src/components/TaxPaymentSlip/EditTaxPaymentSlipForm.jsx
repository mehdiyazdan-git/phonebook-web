import React, {useEffect} from 'react';
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
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const EditTaxPaymentSlipForm = ({ taxPaymentSlip, onUpdateTaxPaymentSlip, show, onHide ,onUploadFile,onFileDelete}) => {
    const http = useHttp();
    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    const findById = async (id) => {
        try {
            const response = await http.get(`/tax-payment-slips/${id}`);
            return response.data;
        } catch (error) {
            console.error('An error occurred while fetching the tax payment slip:', error);
            // Handle the error appropriately,
            // For example, you might want to close the modal or show an error message
            onHide();
            // Return null or appropriate fallback data
            return null;
        }
    }

    useEffect(() => {
        if (taxPaymentSlip.id) {
            findById(taxPaymentSlip.id)
                .then(r => {
                    if (r) { // Make sure the response data is not null
                        setCreateAtJalali(r.createAtJalali);
                        setLastModifiedAtJalali(r.lastModifiedAtJalali);
                        setCreateByFullName(r.createByFullName);
                        setLastModifiedByFullName(r.lastModifiedByFullName);
                    }
                })
                .catch(error => {
                    // Handle errors if findById or the .then() block does not catch them
                    console.error('An error occurred in useEffect while fetching the tax payment slip:', error);
                    onHide(); // Optionally close the modal
                });
        }
    }, [taxPaymentSlip.id, onHide]); // Add taxPaymentSlip.id and onHide as dependencies
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
    const defaultValues = {
        id: taxPaymentSlip.id,
        issueDate: taxPaymentSlip.issueDate,
        slipNumber: taxPaymentSlip.slipNumber,
        type: taxPaymentSlip.type,
        amount: taxPaymentSlip.amount,
        period: taxPaymentSlip.period,
        companyId: taxPaymentSlip.companyId,
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
                                <DateInput name="issueDate" label={"تاریخ صدور"}/>
                            </Col>
                            <Col>
                                <TextInput name="slipNumber" label={"شماره فیش"}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <SelectInput
                                    name="type"
                                    label={"نوع فیش"}
                                    options={[
                                        {value: 'CORPORATE_INCOME_TAX', label: 'فیش پرداخت مالیات عملکرد اشخاص حقوقی'},
                                        {value: 'PAYROLL_TAX', label: 'فیش پرداخت مالیات بر حقوق'},
                                        {value: 'VALUE_ADDED_TAX', label: 'فیش پرداخت مالیات بر ارزش افزوده'},
                                        {value: 'QUARTERLY_TRANSACTIONS', label: 'فیش پرداخت معاملات فصلی'},
                                        {value: 'PROPERTY_RENT_TAX', label: 'فیش پرداخت مالیات اجاره املاک'},
                                        {value: 'PROPERTY_TRANSFER_TAX', label: 'فیش پرداخت مالیات نقل و انتقال املاک'},
                                        {value: 'OTHER_FEES_AND_CHARGES', label: 'فیش پرداخت سایر عوارض و وجوه'}
                                    ]}
                                />
                            </Col>
                            <Col>
                                <NumberInput name="amount" label={"مبلغ"}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="period" label={"دوره مالی"}/>
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
export default EditTaxPaymentSlipForm;
