import React, { useState } from 'react';
import CreateTaxPaymentSlipForm from './CreateTaxPaymentSlipForm';
import EditTaxPaymentSlipForm from './EditTaxPaymentSlipForm';
import Button from "../../utils/Button";
import Table from "../table/Table";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';
import FileUpload from "../../utils/formComponents/FileUpload";
import DownloadTemplate from "../../utils/formComponents/DownloadTemplate";
import {useParams} from "react-router-dom";
import moment from "jalali-moment";
import {formatNumber} from "../../utils/util-functions";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import IconAttach from "../assets/icons/IconAttach";


const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const TaxPaymentSlips = () => {
    const {companyId} = useParams();
    const [editingTaxPaymentSlip, setEditingTaxPaymentSlip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const getAllTaxPaymentSlips = async (queryParams) => {
        const url = `/tax-payment-slips?companyId=${Number(companyId)}&${queryParams.toString()}`;
        try {
            const response = await http.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const createTaxPaymentSlip = async (data) => {
        return await http.post("/tax-payment-slips", data);
    };

    const updateTaxPaymentSlip = async (id, data) => {
        return await http.put(`/tax-payment-slips/${id}`, data);
    };

    const removeTaxPaymentSlip = async (id) => {
        return await http.delete(`/tax-payment-slips/${id}`);
    };

    const handleAddTaxPaymentSlip = async (newTaxPaymentSlip) => {
        const response = await createTaxPaymentSlip(newTaxPaymentSlip);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger);
        }
    };

    const handleUpdateTaxPaymentSlip = async (updatedTaxPaymentSlip) => {
        const response = await updateTaxPaymentSlip(updatedTaxPaymentSlip.id, updatedTaxPaymentSlip);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger);
            setEditingTaxPaymentSlip(null);
        }
    };

    const handleDeleteTaxPaymentSlip = async (id) => {
        await removeTaxPaymentSlip(id);
        setRefreshTrigger(!refreshTrigger);
    };
    const onUploadFile = async (id,formData) => {
      return await http.post(`/tax-payment-slips/${id}/upload-file`, formData)
            .then(response => {
                if (response.status === 201){
                    setRefreshTrigger(!refreshTrigger);
                    return response;
                }}
            )
    }
    const onFileDelete = async (id) => {
       return await http.delete(`/tax-payment-slips/${id}/delete-file`)
            .then((response) => {
                if (response.status === 204) {
                    setRefreshTrigger(!refreshTrigger);
                    return response;
                }
            })
    };

    const convertToPersianCaption = (caption) => {
        const persianCaptions = {
            CORPORATE_INCOME_TAX: "عملکرد",
            PAYROLL_TAX: "حقوق",
            VALUE_ADDED_TAX: "ارزش افزوده",
            QUARTERLY_TRANSACTIONS: "معاملات فصلی",
            PROPERTY_RENT_TAX: "اجاره املاک",
            PROPERTY_TRANSFER_TAX: "نقل و انتقال املاک",
            OTHER_FEES_AND_CHARGES: "سایر عوارض و وجوه"
        };
        return persianCaptions[caption] || caption;
    };
    const options=[
            { value: 'CORPORATE_INCOME_TAX', label: 'فیش پرداخت مالیات عملکرد اشخاص حقوقی' },
            { "value": 'PAYROLL_TAX', "label": 'فیش پرداخت مالیات بر حقوق' },
            { value: 'VALUE_ADDED_TAX', label: 'فیش پرداخت مالیات بر ارزش افزوده' },
            { value: 'QUARTERLY_TRANSACTIONS', label: 'فیش پرداخت معاملات فصلی' },
            { value: 'PROPERTY_RENT_TAX', label: 'فیش پرداخت مالیات اجاره املاک' },
            { value: 'PROPERTY_TRANSFER_TAX', label: 'فیش پرداخت مالیات نقل و انتقال املاک' },
            { value: 'OTHER_FEES_AND_CHARGES', label: 'فیش پرداخت سایر عوارض و وجوه' }
]

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true, searchable: true },
        { key: 'issueDate', title: 'تاریخ صدور', width: '10%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.issueDate) },
        { key: 'slipNumber', title: 'شماره فیش', width: '10%', sortable: true, searchable: true },
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
        { key: 'amount', title: 'مبلغ', width: '10%', sortable: true, searchable: true, render: (item) => formatNumber(item.amount) },
        { key: 'period', title: 'دوره مالی', width: '10%', sortable: true, searchable: true },
        { key: 'fileName', title: 'نام فایل', width: '10%', sortable: true, searchable: true },
        { key: 'fileName', title: 'فایل', width: '2%', render : (item) => item.fileName !== null  ? <IconAttach/> : '' },

    ];



    async function downloadExcelFile() {
        await http.get('/tax-payment-slips/export', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "tax_payment_slips.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <div>
                <CreateTaxPaymentSlipForm
                    onAddTaxPaymentSlip={handleAddTaxPaymentSlip}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    companyId={Number(companyId)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={getAllTaxPaymentSlips}
                onEdit={(taxPaymentSlip) => {
                    setEditingTaxPaymentSlip(taxPaymentSlip);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteTaxPaymentSlip}
                refreshTrigger={refreshTrigger}
            />

            {editingTaxPaymentSlip && (
                <EditTaxPaymentSlipForm
                    taxPaymentSlip={editingTaxPaymentSlip}
                    show={showEditModal}
                    onUpdateTaxPaymentSlip={handleUpdateTaxPaymentSlip}
                    onHide={() => {
                        setEditingTaxPaymentSlip(null);
                        setEditShowModal(false);
                    }}
                    onUploadFile={onUploadFile}
                    onFileDelete={onFileDelete}
                />
            )}
            <ButtonContainer lastChild={<FileUpload uploadUrl={"/tax-payment-slips/import"}/>}>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="secondary" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <DownloadTemplate
                    downloadUrl="/tax-payment-slips/template"
                    buttonLabel="دانلود الگوی فیش پرداخت"
                    fileName="tax_payment_slip_template.xlsx"
                />
            </ButtonContainer>
        </div>
    );
};

export default TaxPaymentSlips;
