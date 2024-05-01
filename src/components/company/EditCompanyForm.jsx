import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import {Alert, Col, Row} from "react-bootstrap";
import {Form} from "../../utils/Form";
import {TextInput} from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import Button from "../../utils/Button";
import {useNavigate, useParams} from "react-router-dom";
import useHttp from "../../hooks/useHttp";

const EditCompanyForm = () => {
    const navigate = useNavigate();
    const {companyId} = useParams();
    const  [successUpdate,setSuccessUpdate] = useState(false);
    const http = useHttp();
    const validationSchema = Yup.object().shape({
        taxEconomicCode: Yup.string().required('کد اقتصادی الزامیست.'),
        companyName: Yup.string().required('نام شرکت الزامیست.'),
        nationalId: Yup.string().required('شناسه ملی الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const findById = async (id)     => {
        return await http.get(`/companies/${id}`).then(r => r.data);
    }
    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    useEffect(() => {
        if (companyId) {
            findById(Number(companyId)).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
            });
        }
    }, []);

    const updateCompany = async (id, data) => {
        return await http.put(`/companies/${id}`, data);
    };

    const onSubmit = async (data) => {
        console.log(data)
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
    const initialValues  = {
        id: '',
        taxEconomicCode: '',
        taxFileNumber: '',
        taxFileClass: '',
        taxTrackingID: '',
        taxPortalUsername: '',
        taxPortalPassword: '',
        taxDepartment: '',
        companyName: '',
        nationalId: '',
        registrationNumber: '',
        registrationDate: '',
        address: '',
        postalCode: '',
        phoneNumber: '',
        faxNumber: '',
        softwareUsername: '',
        softwarePassword: '',
        softwareCallCenter: '',
        insurancePortalUsername: '',
        insurancePortalPassword: '',
        insuranceBranch: '',
        letterPrefix: '',
    }
    const handleDefaultValues = async () => {
       try {
           if (typeof Number(companyId) === 'number' && companyId > 0){
               return await http
                   .get(`/companies/${Number(companyId)}`)
                   .then(response => response.data);
           }
           return initialValues;
       }catch (e){
           if (e.response && e.response.status === 403){
               navigate('/login');
           }
       }
    }

    return (
        <div className="container">
            <div style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container-fluid modal-form">
                    <Form
                        defaultValues={handleDefaultValues}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <TextInput name="taxEconomicCode" label="کد اقتصادی" />
                                <TextInput name="taxFileNumber" label="شماره پرونده مالیاتی" />
                                <TextInput name="taxFileClass" label="طبقه پرونده مالیاتی" />
                            </Col>
                            <Col>
                                <TextInput name="taxTrackingID" label="شناسه رهگیری مالیاتی" />
                                <TextInput name="taxPortalUsername" label="نام کاربری پرتال مالیاتی" />
                            </Col>
                            <Col>
                                <TextInput name="taxPortalPassword" label="رمز عبور پرتال مالیاتی" />
                                <TextInput name="taxDepartment" label="اداره مالیاتی" />
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <TextInput name="companyName" label="نام شرکت" />
                                <TextInput name="nationalId" label="شناسه ملی" />
                                <TextInput name="registrationNumber" label="شماره ثبت" />
                            </Col>
                            <Col>
                                <DateInput name="registrationDate" label="تاریخ ثبت" />
                                <TextInput name="address" label="آدرس" />
                                <TextInput name="postalCode" label="کد پستی" />
                            </Col>
                            <Col>
                                <TextInput name="phoneNumber" label="شماره تلفن" />
                                <TextInput name="faxNumber" label="شماره فکس" />
                                <TextInput name="letterPrefix" label="کاراکتر نامه" />
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <TextInput name="softwareUsername" label="نام کاربری نرم‌افزار" />
                            </Col>
                            <Col>
                                <TextInput name="softwarePassword" label="رمز عبور نرم‌افزار" />
                            </Col>
                            <Col>
                                <TextInput name="softwareCallCenter" label="مرکز تماس نرم‌افزار" />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput name="insurancePortalUsername" label="نام کاربری پرتال بیمه" />
                            </Col>
                            <Col>
                                <TextInput name="insurancePortalPassword" label="رمز عبور پرتال بیمه" />
                            </Col>
                            <Col>
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
        </div>
    );
};

export default EditCompanyForm;
