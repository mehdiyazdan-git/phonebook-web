import React, {useState} from 'react';
import * as Yup from "yup";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import {Alert, Col, Row} from "react-bootstrap";
import {Form} from "../../utils/Form";
import {TextInput} from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import Button from "../../utils/Button";
import {useParams} from "react-router-dom";
import useHttp from "../../hooks/useHttp";

const EditCompanyForm = () => {
    const {companyId} = useParams();
    const  [successUpdate,setSuccessUpdate] = useState(false);
    const http = useHttp();
    const validationSchema = Yup.object().shape({
        taxEconomicCode: Yup.string().required('کد اقتصادی الزامیست.'),
        companyName: Yup.string().required('نام شرکت الزامیست.'),
        nationalId: Yup.string().required('شناسه ملی الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const updateCompany = async (id, data) => {
        return await http.put(`/companies/${id}`, data);
    };

    const onSubmit = async (data) => {
        const formattedDate = moment(new Date(data.registrationDate)).format('YYYY-MM-DD');
        const formData = {
            ...data,
            registrationDate: formattedDate
        }
        await updateCompany(companyId,formData)
            .then(response => {
                if (response.status === 200){
                    setSuccessUpdate(true)
                }
            })
    };

    return (
        <div className="container">
            <div style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container-fluid modal-form">
                    <Form
                        defaultValues={async () => await http
                            .get(`/companies/${Number(companyId)}`)
                            .then(response => response.data)}
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
                        <Button  variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>
                {successUpdate &&  <Alert style={{fontFamily:"IRANSans",fontSize:"0.6rem"}} variant={"success"}>بروز رسانی موفق</Alert>}
            </div>
        </div>
    );
};

export default EditCompanyForm;
