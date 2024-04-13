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

const EditShareHolderForm = ({ shareholder, onUpdateShareHolder, show, onHide, onUploadFile, onFileDelete }) => {
    const validationSchema = Yup.object().shape({
        personId: Yup.number().required('شناسه شخص الزامیست.'),
        numberOfShares: Yup.number().required('تعداد سهام الزامیست.').positive('تعداد سهام باید مثبت باشد.'),
        percentageOwnership: Yup.number().required('درصد مالکیت الزامیست.').min(0, 'درصد مالکیت نمی‌تواند منفی باشد.').max(100, 'درصد مالکیت نمی‌تواند بیشتر از ۱۰۰ باشد.'),
        sharePrice: Yup.number().required('قیمت سهم الزامیست.').positive('قیمت سهم باید مثبت باشد.'),
        shareType: Yup.string().required('نوع سهم الزامیست.'),
        companyId: Yup.number().required('شناسه شرکت الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const http = useHttp();

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
            <Modal.Header style={{ backgroundColor: "rgba(63,51,106,0.6)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>ویرایش</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
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
                                <NumberInput name="numberOfShares" label={"تعداد سهام"} />
                            </Col>
                            <Col>
                                <NumberInput name="sharePrice" label={"قیمت سهم"} />
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="percentageOwnership" label={"درصد مالکیت"} />
                            </Col>
                            <Col>
                                <SelectInput
                                    name="shareType"
                                    label={"نوع سهم"}
                                    options={[{ value: 'REGISTERED', label: 'ثبت شده' }, { value: 'BEARER', label: 'حامل' }]}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="id" label={"شناسه"} disabled={true} />
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
                        taxPaymentSlip={shareholder}
                        onUploadFile={onUploadFile}
                        onFileDelete={onFileDelete}
                        downloadUrl={`/shareholders/${shareholder.id}/download-file`}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditShareHolderForm;
