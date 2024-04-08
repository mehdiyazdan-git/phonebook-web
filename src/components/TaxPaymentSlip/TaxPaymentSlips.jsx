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
import {formatNumber} from "../../utils/util-functions";

const TaxPaymentSlips = () => {
    const {companyId} = useParams();
    const [editingTaxPaymentSlip, setEditingTaxPaymentSlip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const getAllTaxPaymentSlips = async (queryParams) => {
        return await http.get(`/tax-payment-slips?companyId=${Number(companyId)}&${queryParams.toString()}`).then(r => r.data);
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

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true, searchable: true },
        { key: 'personFirstName', title: 'نام', width: '10%', sortable: true, searchable: true },
        { key: 'personLastName', title: 'نام خانوادگی', width: '10%', sortable: true, searchable: true },
        { key: 'numberOfShares', title: 'تعداد سهام', width: '10%', sortable: true, searchable: true },
        {
            key: 'percentageOwnership',
            title: 'درصد مالکیت',
            width: '10%',
            sortable: true,
            searchable: true,
            render: (item) => ` % ${item.percentageOwnership}`
        },
        {
            key: 'sharePrice',
            title: 'قیمت سهم',
            width: '10%',
            sortable: true,
            searchable: true,
            render: (item) => formatNumber(item.sharePrice)
        },
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
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="secondary" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <FileUpload uploadUrl={"/tax-payment-slips/import"}/>
                <DownloadTemplate
                    downloadUrl="/tax-payment-slips/template"
                    buttonLabel="دانلود الگوی فیش پرداخت"
                    fileName="tax_payment_slip_template.xlsx"
                />
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
                />
            )}
        </div>
    );
};

export default TaxPaymentSlips;
