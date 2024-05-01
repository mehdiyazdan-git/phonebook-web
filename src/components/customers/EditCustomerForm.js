import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import DateInput from "../../utils/formComponents/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import {verifyIranianLegalId} from "@persian-tools/persian-tools";
import {LegalIdInput} from "../../utils/formComponents/LegalIdInput";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";
import useHttp from "../../hooks/useHttp";

const EditCustomerForm = ({ customer, onUpdateCustomer, show, onHide }) => {
    const http = useHttp();

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

    const findById = async (id)=> {
        return await http.get(`/customers/${id}`).then(r => r.data);
    }
    const [customerName, setCustomerName] = React.useState('');

    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    useEffect(() => {
        if (customer.id) {
            findById(customer?.id).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
                setCustomerName(r.name)
            });
        }
    }, []);

    const onSubmit = (data) => {
        if (data.registerDate) {
            data.registerDate = moment(new Date(data.registerDate)).format('YYYY-MM-DD');
        }
        console.log("on form submit: ", data)
        onUpdateCustomer(data)
        onHide();
    };
    useEffect(() => {
        console.log("on form pop-up: ", customer)
    })

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>
                    {`ویرایش : ${customerName}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={customer}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <TextInput name="id" label={"شناسه"} disabled={true} />
                        <TextInput name="name" label={"نام"} />
                        <TextInput name="address" label={"آدرس"} />
                        <TextInput name="phoneNumber" label={"شماره تماس:"} />
                        <LegalIdInput name="nationalIdentity" label={"شناسه ملی:"} />
                        <TextInput name="registerCode" label={"کد ثبتی:"} />
                        <DateInput name="registerDate" label={"تاریخ ثبت"} />

                        <Button variant="success" type="submit">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
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
            </Modal.Body>
        </Modal>
    );
};

export default EditCustomerForm;
