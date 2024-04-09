import React, { useState } from 'react';
import CreateInsuranceSlipForm from './CreateInsuranceSlipForm';
import EditInsuranceSlipForm from './EditInsuranceSlipForm';
import Button from "../../utils/Button";
import Table from "../table/Table";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';
import FileUpload from "../../utils/formComponents/FileUpload";
import DownloadTemplate from "../../utils/formComponents/DownloadTemplate";
import { useParams } from "react-router-dom";
import {formatNumber} from "../../utils/util-functions";
import moment from "jalali-moment";
import {Col, Row} from "react-bootstrap";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const InsuranceSlips = () => {
    const { companyId } = useParams();
    const [editingInsuranceSlip, setEditingInsuranceSlip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [errorMessage,setErrorMessage] = useState('');
    const http = useHttp();

    const getAllInsuranceSlips = async (queryParams) => {
        const url = `/insurance-slips?companyId=${Number(companyId)}&${queryParams.toString()}`;
        console.log(url);
        try{
            const response = await http.get(url);
            return response.data;
        }catch(error){
            setErrorMessage(error.response.data.message);
            console.error(error.response.data.message);
            return [];
        }
    };

    const createInsuranceSlip = async (data) => {
        return await http.post("/insurance-slips", data);
    };

    const updateInsuranceSlip = async (id, data) => {
        return await http.put(`/insurance-slips/${id}`, data);
    };

    const removeInsuranceSlip = async (id) => {
        return await http.delete(`/insurance-slips/${id}`);
    };

    const handleAddInsuranceSlip = async (newInsuranceSlip) => {
        const response = await createInsuranceSlip(newInsuranceSlip);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger);
        }
    };

    const handleUpdateInsuranceSlip = async (updatedInsuranceSlip) => {
        const response = await updateInsuranceSlip(updatedInsuranceSlip.id, updatedInsuranceSlip);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger);
            setEditingInsuranceSlip(null);
        }
    };

    const handleDeleteInsuranceSlip = async (id) => {
        await removeInsuranceSlip(id);
        setRefreshTrigger(!refreshTrigger);
    };
    const convertToPersianCaption = (caption) => {
        const persianCaptions = {
            'INSURANCE_PREMIUM': 'حق بیمه',
            'PENALTY': 'جریمه',
        };
        return persianCaptions[caption] || caption;
    };

const options = [
    { value: 'INSURANCE_PREMIUM', label: 'حق بیمه' },
    { value: 'PENALTY', label: 'جریمه' },
    ]


    const columns = [
        { key: 'id', title: 'ردیف', width: '10%', sortable: true, searchable: true },
        { key: 'issueDate', title: 'تاریخ صدور', width: '10%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.issueDate) },
        { key: 'slipNumber', title: 'شناسه فیش', width: '10%', sortable: true, searchable: true},
        {
            key: 'type',
            title: 'نوع فیش',
            width: '10%',
            sortable: true,
            searchable: true,
            render: (item) => convertToPersianCaption(item.type),
            type : 'select',
            options : options
        },
        { key: 'amount', title: 'مبلغ(ریال)', width: '10%', sortable: true, searchable: true, render: (item) => formatNumber(item.amount) },
        { key: 'startDate', title: 'از تاریخ', width: '10%', sortable: true, searchable: true , type: 'date', render: (item) => toShamsi(item.startDate) },
        { key: 'endDate', title: 'تا تاریخ', width: '10%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.endDate)  },
    ];



    async function downloadExcelFile() {
        await http.get('/insurance-slips/export', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "insurance_slips.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <Row>
                <Col>

                </Col>
                <CreateInsuranceSlipForm
                    onAddInsuranceSlip={handleAddInsuranceSlip}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    companyId={Number(companyId)}
                />
            </Row>
            <Table
                columns={columns}
                fetchData={getAllInsuranceSlips}
                onEdit={(insuranceSlip) => {
                    setEditingInsuranceSlip(insuranceSlip);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteInsuranceSlip}
                refreshTrigger={refreshTrigger}
            />

            {editingInsuranceSlip && (
                <EditInsuranceSlipForm
                    insuranceSlip={editingInsuranceSlip}
                    show={showEditModal}
                    onUpdateInsuranceSlip={handleUpdateInsuranceSlip}
                    onHide={() => {
                        setEditingInsuranceSlip(null);
                        setEditShowModal(false);
                    }}
                />
            )}
            <ButtonContainer lastChild={<FileUpload uploadUrl={"/insurance-slips/import"}/>}>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="success" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <DownloadTemplate
                    downloadUrl="/insurance-slips/template"
                    buttonLabel="دانلود الگوی فیش بیمه"
                    fileName="insurance_slip_template.xlsx"
                />
            </ButtonContainer>
        </div>
    );
};

export default InsuranceSlips;
