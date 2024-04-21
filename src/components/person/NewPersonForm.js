import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Modal, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import {TextInput} from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import {Form} from "../../utils/Form";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import { verifyIranianNationalId } from "@persian-tools/persian-tools";
import {NationalIdInput} from "../../utils/formComponents/NationalIdInput";
import {PhoneNumberInput} from "../../utils/formComponents/PhoneNumberInput";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";





const NewPersonForm = ({onAddPerson, show, onHide}) => {
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('نام الزامیست.'),
        lastName: Yup.string().required('نام خانوادگی الزامیست.'),
        nationalId: Yup.string()
            .required('کد ملی الزامیست.')
            .test(
                'is-valid-national-id',
                'کد ملی نامعتبر است.',
                value => verifyIranianNationalId(value)
            ),
    });


    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = (data) => {
        const formattedDate = moment(new Date(data.birthDate)).format('YYYY-MM-DD');
        const formData = {
            ...data,
            birthDate: formattedDate
        }
        if (formData.birthDate === 'Invalid date') {
            formData.birthDate = '';
        }
        onAddPerson(formData);
        onHide();
    };


    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>ایجاد فرد
                    جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={{
                            firstName: '',
                            lastName: '',
                            fatherName: '',
                            nationalId: '',
                            registrationNumber: '',
                            birthDate: '',
                            address: '',
                            postalCode: '',
                            phoneNumber: '',
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <TextInput name="firstName" label={"نام"}/>
                                <TextInput name="lastName" label={"نام خانوادگی"}/>
                                <TextInput name="fatherName" label={"نام پدر"}/>
                                <NationalIdInput name="nationalId" label={"کد ملی"}/>
                            </Col>
                            <Col>
                                <TextInput name="registrationNumber" label={"شماره شناسنامه"}/>
                                <TextInput name="postalCode" label={"کد پستی"}/>
                                <DateInput name="birthDate" label={"تاریخ تولد"}/>
                                <PhoneNumberInput name="phoneNumber" label={"شماره تماس"}/>
                            </Col>
                        </Row>
                        <Row>
                            <TextInput name="address" label={"آدرس"}/>
                        </Row>

                        <Button variant="success" type="submit">
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

export default NewPersonForm;
