import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from 'react-bootstrap';
import { Form } from "../../utils/Form";
import { TextInput } from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import { verifyIranianLegalId } from "@persian-tools/persian-tools";
import { LegalIdInput } from "../../utils/formComponents/LegalIdInput";

const CreateCustomerForm = ({ customer, onAddCustomer, show, onHide }) => {

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('نام الزامیست.'),
        nationalIdentity: Yup.string()
            .nullable()
            .test(
                'is-valid-legal-id',
                'شناسه ملی نامعتبر است.',
                value => !value || verifyIranianLegalId(value)
            ),
    });


    const resolver = useYupValidationResolver(validationSchema);
    const { reset } = useForm({
        defaultValues: {
            id: '',
            name: '',
            address: '',
            phoneNumber: '',
            nationalIdentity: '',
            registerCode: '',
            registerDate: '',
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        if (data.registerDate === '') {
            data.registerDate = moment(new Date(data.registerDate)).format('YYYY-MM-DD');
        }
        onAddCustomer(data);
        reset({
            id: '',
            name: '',
            address: '',
            phoneNumber: '',
            nationalIdentity: '',
            registerCode: '',
            registerDate: '',
        });
        onHide();
    };

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={{ backgroundColor: "rgba(46, 75, 108, 0.8)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container modal-form">
                    <Form
                        defaultValues={customer}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <TextInput name="name" label={"نام"} />
                        <TextInput name="address" label={"آدرس"} />
                        <TextInput name="phoneNumber" label={"شماره تماس:"} />
                        <LegalIdInput name="nationalIdentity" label={"شناسه ملی:"} />
                        <TextInput name="registerCode" label={"کد ثبتی:"} />
                        <DateInput name="registerDate" label={"تاریخ ثبت"} />

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

export default CreateCustomerForm;
