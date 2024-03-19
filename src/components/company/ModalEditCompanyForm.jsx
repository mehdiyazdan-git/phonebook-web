import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";

const ModalEditCompanyForm = ({ company, onUpdateCompany, show, onHide }) => {

    const validationSchema = Yup.object().shape({
        taxEconomicCode: Yup.string().required('کد اقتصادی الزامیست.'),
        taxFileNumber: Yup.string().required('شماره پرونده مالیاتی الزامیست.'),
        taxFileClass: Yup.string().required('طبقه پرونده مالیاتی الزامیست.'),
        taxTrackingID: Yup.string().required('شناسه رهگیری مالیاتی الزامیست.'),
        taxPortalUsername: Yup.string().required('نام کاربری پرتال مالیاتی الزامیست.'),
        taxPortalPassword: Yup.string().required('رمز عبور پرتال مالیاتی الزامیست.'),
        taxDepartment: Yup.string().required('اداره مالیاتی الزامیست.'),
        companyName: Yup.string().required('نام شرکت الزامیست.'),
        nationalId: Yup.string().required('شناسه ملی الزامیست.'),
        registrationNumber: Yup.string().required('شماره ثبت الزامیست.'),
        registrationDate: Yup.string().required('تاریخ ثبت الزامیست.'),
        address: Yup.string().required('آدرس الزامیست.'),
        postalCode: Yup.string().required('کد پستی الزامیست.'),
        phoneNumber: Yup.string().required('شماره تلفن الزامیست.'),
        faxNumber: Yup.string().required('شماره فکس الزامیست.'),
        softwareUsername: Yup.string().required('نام کاربری نرم‌افزار الزامیست.'),
        softwarePassword: Yup.string().required('رمز عبور نرم‌افزار الزامیست.'),
        softwareCallCenter: Yup.string().required('مرکز تماس نرم‌افزار الزامیست.'),
        insurancePortalUsername: Yup.string().required('نام کاربری پرتال بیمه الزامیست.'),
        insurancePortalPassword: Yup.string().required('رمز عبور پرتال بیمه الزامیست.'),
        insuranceBranch: Yup.string().required('شعبه بیمه الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = (data) => {
        const formattedDate = moment(new Date(data.registrationDate)).format('YYYY-MM-DD');
        const formData = {
            ...data,
            registrationDate: formattedDate
        }
        console.log("on form submit: ", formData);
        onUpdateCompany(formData);
        onHide();
    };

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={{ backgroundColor: "rgba(63,51,106,0.6)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>ایجاد شرکت جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container-fluid modal-form">
                    <Form
                        defaultValues={company}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <TextInput name="taxEconomicCode" label="کد اقتصادی" />
                                <TextInput name="taxFileNumber" label="شماره پرونده مالیاتی" />
                                <TextInput name="taxFileClass" label="طبقه پرونده مالیاتی" />
                                <TextInput name="taxTrackingID" label="شناسه رهگیری مالیاتی" />
                                <TextInput name="taxPortalUsername" label="نام کاربری پرتال مالیاتی" />
                                <TextInput name="taxPortalPassword" label="رمز عبور پرتال مالیاتی" />
                                <TextInput name="taxDepartment" label="اداره مالیاتی" />
                            </Col>
                            <Col>
                                <TextInput name="companyName" label="نام شرکت" />
                                <TextInput name="nationalId" label="شناسه ملی" />
                                <TextInput name="registrationNumber" label="شماره ثبت" />
                                <DateInput name="registrationDate" label="تاریخ ثبت" />
                                <TextInput name="address" label="آدرس" />
                                <TextInput name="postalCode" label="کد پستی" />
                                <TextInput name="phoneNumber" label="شماره تلفن" />
                                <TextInput name="faxNumber" label="شماره فکس" />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="softwareUsername" label="نام کاربری نرم‌افزار" />
                                <TextInput name="softwarePassword" label="رمز عبور نرم‌افزار" />
                                <TextInput name="softwareCallCenter" label="مرکز تماس نرم‌افزار" />
                            </Col>
                            <Col>
                                <TextInput name="insurancePortalUsername" label="نام کاربری پرتال بیمه" />
                                <TextInput name="insurancePortalPassword" label="رمز عبور پرتال بیمه" />
                                <TextInput name="insuranceBranch" label="شعبه بیمه" />
                            </Col>
                        </Row>

                        <Button variant="success" type="submit">
                            ویرایش
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

export default ModalEditCompanyForm;
