import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import SelectInput from "../../utils/formComponents/SelectInput";
import NumberInput from "../../utils/formComponents/NumberInput";
import AsyncSelectInput from "../form/AsyncSelectInput";
import useHttp from "../../hooks/useHttp";
import DateInput from "../../utils/formComponents/DateInput";
import { saveAs } from 'file-saver';
import FileComponent from "../file/FileComponent";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const EditInsuranceSlipForm = ({ insuranceSlip, onUpdateInsuranceSlip, show, onHide,onUploadFile,onFileDelete }) => {
    const validationSchema = Yup.object().shape({
        issueDate: Yup.date().required('تاریخ صدور الزامیست.'),
        slipNumber: Yup.string().required('شماره فیش الزامیست.'),
        type: Yup.string().required('نوع الزامیست.'),
        amount: Yup.number().required('مبلغ الزامیست.').positive('مبلغ باید مثبت باشد.'),
        startDate: Yup.date().required('تاریخ شروع الزامیست.'),
        endDate: Yup.date().required('تاریخ پایان الزامیست.'),
        companyId: Yup.number().required('شناسه شرکت الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const http = useHttp();

    const [fileData, setFileData] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');


    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    const findById = async (id)     => {
        return await http.get(`/insurance-slips/${id}`).then(r => r.data);
    }

    useEffect(() => {
        if (insuranceSlip.id) {
            findById(insuranceSlip.id).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
            });
        }
    }, []);

    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const onSubmit = (data) => {
        console.log("on form submit: ", data);
        onUpdateInsuranceSlip(data);
        onHide();
    };
    const downloadScannedCertificate = () => {
        http.get(`/insurance-slips/${insuranceSlip.id}/download-file`,{ responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                const fileBlob = new Blob([blobData], { type: fileType });
                const fileUrl = URL.createObjectURL(fileBlob);
                saveAs(fileUrl, fileName);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    useEffect(() => {
        console.log("on form pop-up: ", insuranceSlip);
    });

    const DownloadLink = ({fileName, fileExtension}) => {
        const handleClick = () => {
            downloadScannedCertificate();
        };
        return (
            <button onClick={handleClick}>
                {`دانلود فایل ضمیمه (${fileName}.${fileExtension})`}
            </button>
        );
    };
    const defaultValues= {
        id: insuranceSlip.id,
        issueDate: insuranceSlip.issueDate,
        slipNumber: insuranceSlip.slipNumber,
        type: insuranceSlip.type,
        amount: insuranceSlip.amount,
        startDate: insuranceSlip.startDate,
        endDate: insuranceSlip.endDate,
        companyId: insuranceSlip.companyId,
    }
    const customMessages = {
        noOptionsMessage: () => "هیچ رکوردی یافت نشد.."
    };

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>ویرایش</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={defaultValues}
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
                                    defaultValue={Number(insuranceSlip.companyId)}
                                    noOptionsMessage={customMessages.noOptionsMessage}
                                />
                            </Col>
                        </Row>
                        <hr/>
                        <FileComponent
                            taxPaymentSlip={insuranceSlip}
                            onUploadFile={onUploadFile}
                            onFileDelete={onFileDelete}
                            downloadUrl={`/insurance-slips/${insuranceSlip.id}/download-file`}
                        />
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

export default EditInsuranceSlipForm;
