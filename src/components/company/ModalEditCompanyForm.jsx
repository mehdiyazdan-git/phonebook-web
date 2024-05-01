import React, {useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";
import useHttp from "../../hooks/useHttp";

function parseAndFormatDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const ModalEditCompanyForm = ({ company, onUpdateCompany, show, onHide }) => {
    const http = useHttp();

    const validationSchema = Yup.object().shape({
        taxEconomicCode: Yup.string().required('کد اقتصادی الزامیست.'),
        companyName: Yup.string().required('نام شرکت الزامیست.'),
        nationalId: Yup.string().required('شناسه ملی الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = (data) => {
        console.log('Submitted data:', data)
        const trimmedData = Object.keys(data).reduce((acc, key) => {
            if (typeof data[key] === 'string' && data[key].trim() !== '') {
                acc[key] = data[key].trim();
            } else {
                acc[key] = data[key];
            }
            return acc;
        }, {});

        if (trimmedData.registrationDate && typeof trimmedData.registrationDate === 'object') {
            trimmedData.registrationDate = parseAndFormatDate(trimmedData.registrationDate);
        }
        onUpdateCompany(trimmedData);
        onHide();
    };
    const findById = async (id)     => {
        return await http.get(`/companies/${id}`).then(r => r.data);
    }
    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    useEffect(() => {
        if (company.id) {
            findById(company.id).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
            });
        }
    }, []);

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>ویرایش</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
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
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
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

export default ModalEditCompanyForm;
