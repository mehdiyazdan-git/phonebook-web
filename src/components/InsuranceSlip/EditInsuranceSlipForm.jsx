import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/formComponents/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import SelectInput from "../../utils/formComponents/SelectInput";
import FileUploadForm from "../../utils/formComponents/FileUploadForm";
import NumberInput from "../../utils/formComponents/NumberInput";
import AsyncSelectInput from "../form/AsyncSelectInput";
import useHttp from "../../hooks/useHttp";
import DateInput from "../../utils/formComponents/DateInput";
import { saveAs } from 'file-saver';

const EditInsuranceSlipForm = ({ insuranceSlip, onUpdateInsuranceSlip, show, onHide }) => {
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

    const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    const onSubmitFile = async (formData) => {
        try {
            const response = await http.post(`/insurance-slips/${Number(insuranceSlip.id)}/upload-file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
            // Update the file preview data
            const file = formData.get("file");
            setFileData(file);
            setFileName(file.name);
            setFileType(file.type);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

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

    return (
        <Modal size={"lg"} show={show}>
            <Modal.Header style={{ backgroundColor: "rgba(63,51,106,0.6)" }}>
                <Modal.Title style={{ fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff" }}>ویرایش</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "rgba(240,240,240,0.3)" }}>
                <div className="container modal-form">
                    <Form
                        defaultValues={insuranceSlip}
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
                                />
                            </Col>
                        </Row>

                        <Button variant="success" type="submit">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                    <hr />
                    <h4>فایل های ضمیمه</h4>
                    <DownloadLink fileName={insuranceSlip.fileName} fileExtension={insuranceSlip.fileExtension} />

                    <Row>
                        <FileUploadForm onSubmit={onSubmitFile}/>
                        {insuranceSlip.hasFile && (
                            <Button onClick={downloadScannedCertificate} variant="primary">
                                Download Scanned Certificate
                            </Button>
                        )}

                    </Row>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditInsuranceSlipForm;
