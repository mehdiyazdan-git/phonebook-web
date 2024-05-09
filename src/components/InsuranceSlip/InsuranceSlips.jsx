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
import IconAttach from "../assets/icons/IconAttach";
import {SiMicrosoftexcel} from "react-icons/si";
import NewPersonForm from "../person/NewPersonForm";
import {date} from "yup";

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

    const formatDate = (date) => moment(new Date(date)).format('YYYY-MM-DD');

    const handleAddInsuranceSlip = async (newInsuranceSlip) => {
        try {
            if (newInsuranceSlip.issueDate){
                newInsuranceSlip.issueDate = formatDate(newInsuranceSlip.issueDate)
            }
            if (newInsuranceSlip.startDate){
                newInsuranceSlip.startDate = formatDate(newInsuranceSlip.startDate)
            }
            if (newInsuranceSlip.endDate){
                newInsuranceSlip.endDate = formatDate(newInsuranceSlip.endDate)
            }
            const response = await createInsuranceSlip(newInsuranceSlip);
            if (response.status === 201) {
                setRefreshTrigger(!refreshTrigger);
            }
        } catch (error) {
            console.error('Failed to add insurance slip:', error);
            // Optionally, add error handling logic here, such as setting an error state or showing a notification
        }
    };


    const handleUpdateInsuranceSlip = async (updatedInsuranceSlip) => {
        try {
            if (updatedInsuranceSlip.issueDate){
                updatedInsuranceSlip.issueDate = formatDate(updatedInsuranceSlip.issueDate)
            }
            if (updatedInsuranceSlip.startDate){
                updatedInsuranceSlip.startDate = formatDate(updatedInsuranceSlip.startDate)
            }
            if (updatedInsuranceSlip.endDate){
                updatedInsuranceSlip.endDate = formatDate(updatedInsuranceSlip.endDate)
            }
            const response = await updateInsuranceSlip(updatedInsuranceSlip.id, updatedInsuranceSlip);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingInsuranceSlip(null);
            }
        } catch (error) {
            console.error('Failed to update insurance slip:', error);
            // Handle error (e.g., user notification, rollback logic)
        }
    };


    const handleDeleteInsuranceSlip = async (id) => {
        try {
            await removeInsuranceSlip(id);
            setRefreshTrigger(!refreshTrigger);
        } catch (error) {
            console.error('Failed to delete insurance slip:', error);
            // Handle error (e.g., user notification)
        }
    };


    const onUploadFile = async (id, formData) => {
        try {
            const response = await http.post(`/insurance-slips/${id}/upload-file`, formData);
            if (response.status === 201) {
                setRefreshTrigger(!refreshTrigger);
                return response;
            }
        } catch (error) {
            console.error('Failed to upload file:', error);
            // Handle error (e.g., display an error message to the user)
            throw error;  // Re-throw error if you want calling function to handle it
        }
    };

    const onFileDelete = async (id) => {
        try {
            const response = await http.delete(`/insurance-slips/${id}/delete-file`);
            if (response.status === 204) {
                setRefreshTrigger(!refreshTrigger);
                return response;
            }
        } catch (error) {
            console.error('Failed to delete file:', error);
            // Optionally, you can handle the error more explicitly here, e.g., by showing a user notification
            throw error;  // You can re-throw the error if you want the caller to handle it as well
        } finally {
            // Code here will run regardless of whether the try block succeeded or the catch block was executed.
            // For example, you might want to disable a loading indicator here.
        }
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
        { key: 'fileName', title: 'نام فایل', width: '10%', sortable: true, searchable: true },
        { key: 'fileName', title: 'فایل', width: '2%', render : (item) => item.fileName !== null  ? <IconAttach/> : '' },
    ];



    async function downloadExcelFile() {
        await http.get(`/insurance-slips/export/${Number(companyId)}`, { responseType: 'blob' })
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
            <ButtonContainer>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="success" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <CreateInsuranceSlipForm
                    onAddInsuranceSlip={handleAddInsuranceSlip}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    companyId={Number(companyId)}
                />
            </ButtonContainer>
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
                    onUploadFile={onUploadFile}
                    onFileDelete={onFileDelete}
                />
            )}
        </div>
    );
};

export default InsuranceSlips;
