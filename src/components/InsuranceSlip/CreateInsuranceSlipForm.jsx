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

const CreateInsuranceSlipForm = ({ onAddInsuranceSlip, show, onHide, companyId }) => {
    const validationSchema = Yup.object().shape({
        issueDate: Yup.date()
            .typeError('تاریخ صدور نا معتبر است.')
            .required('تاریخ صدور الزامیست.'),
        slipNumber: Yup.string().required('شماره فیش الزامیست.'),
        type: Yup.string().required('نوع الزامیست.'),
        amount: Yup.number()
            .typeError('مبلغ باید عدد باشد.')
            .required('مبلغ الزامیست.')
            .positive('مبلغ باید مثبت باشد.')
            .moreThan(0, 'مبلغ باید بزرگتر از صفر باشد.'),
        startDate: Yup.date()
            .typeError('تاریخ شروع نا معتبر است.')
            .required('تاریخ شروع الزامیست.'),
        endDate: Yup.date()
            .typeError('تاریخ پایان نا معتبر است.')
            .required('تاریخ پایان الزامیست.')
            .when('startDate', (startDate, schema) => {
                // Convert startDate to a Date object to check validity
                const start = new Date(startDate);
                return startDate && !isNaN(start.getTime()) ?
                    schema.min(start, 'تاریخ پایان نباید کوچکتر از تاریخ شروع باشد.') :
                    schema;
            }),
        companyId: Yup.number().required('شناسه شرکت الزامیست.'),
    });



    const http = useHttp();


    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const resolver = useYupValidationResolver(validationSchema);
    const { reset } = useForm({
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
            companyId: companyId,
        });
        onHide();
    };
    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={{
                            id: '',
                            issueDate: '',
                            slipNumber: '',
                            type: '',
                            amount: '',
                            startDate: '',
                            endDate: '',
                            companyId: companyId,
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
                            <strong style={{fontFamily:"IRANSans",fontSize:"0.8rem",color:"dodgerblue"}} className="mt-4">دوره مورد محاسبه</strong>
                            <hr />
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
