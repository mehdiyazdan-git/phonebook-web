import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {Col, Modal, Row} from 'react-bootstrap';
import { Form } from "../../utils/Form";
import { TextInput } from "../../utils/formComponents/TextInput";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import Button from "../../utils/Button";
import SelectInput from "../../utils/formComponents/SelectInput";
import useHttp from "../../hooks/useHttp";
import AsyncSelectInput from "../form/AsyncSelectInput";
import NumberInput from "../../utils/formComponents/NumberInput";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const CreateShareHolderForm = ({ shareholder, onAddShareHolder, show, onHide, companyId }) => {
    const validationSchema = Yup.object().shape({
        personId: Yup.number().required('شناسه شخص الزامیست.'),
        numberOfShares: Yup.number()
            .typeError('تعداد سهام باید مقدار عددی باشد')
            .integer('تعداد سهام باید عدد صحیح باشد')
            .required('تعداد سهام الزامیست.').positive('تعداد سهام باید مثبت باشد.')
            .lessThan(2147483647,'تعداد سهام نمیتواند بیشتر از 2,147,483,647 باشد.'),
        percentageOwnership: Yup.number()
            .typeError('درصد مالکیت باید مقدار عددی باشد')
            .required('درصد مالکیت الزامیست.')
            .moreThan(0, 'درصد مالکیت باید بیشتر از صفر باشد.')
            .max(100, 'درصد مالکیت نمی‌تواند بیشتر از ۱۰۰ باشد.'),
        sharePrice: Yup.number()
            .typeError('قیمت سهم باید مقدار عددی باشد')
            .required('قیمت سهم الزامیست.')
            .positive('قیمت سهم باید مثبت باشد.')
            .lessThan(99999999.99,'قیمت سهم نمیتواند بیشتر از 99,999,999/99 باشد.'),
        shareType: Yup.string().required('نوع سهم الزامیست.'),

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
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        console.log("on form submit: ", data);
        onAddShareHolder(data);
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
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={{
                            id: '',
                            personId: '',
                            numberOfShares: '',
                            percentageOwnership: '',
                            sharePrice: '',
                            shareType: '',
                            companyId: Number(companyId),
                            scannedShareCertificate: '',
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <label>{"سهامدار"}</label>
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
                        <hr/>
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

export default CreateShareHolderForm;
