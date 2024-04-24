import React, { useState } from 'react';
import CreateShareHolderForm from './CreateShareHolderForm';
import EditShareHolderForm from './EditShareHolderForm';
import Button from "../../utils/Button";
import Table from "../table/Table";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';
import FileUpload from "../../utils/formComponents/FileUpload";
import DownloadTemplate from "../../utils/formComponents/DownloadTemplate";
import {useParams} from "react-router-dom";
import {formatNumber} from "../../utils/util-functions";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import IconAttach from "../assets/icons/IconAttach";

const ShareHolders = () => {
    const {companyId} = useParams();
    const [editingShareHolder, setEditingShareHolder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();

    const getAllShareHolders = async (queryParams) => {
        const url = `/shareholders?companyId=${Number(companyId)}&${queryParams.toString()}`;
        console.log(url)
        try {
            const response = await http.get(url);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching shareHolders:', error);
            return [];
        }
    };

    const createShareHolder = async (data) => {
        return await http.post("/shareholders", data);
    };

    const updateShareHolder = async (id, data) => {
        return await http.put(`/shareholders/${id}`, data);
    };

    const removeShareHolder = async (id) => {
        return await http.delete(`/shareholders/${id}`);
    };

    const handleAddShareHolder = async (newShareHolder) => {
        try {
            const response = await createShareHolder(newShareHolder);
            if (response.status === 201) {
                setRefreshTrigger(prev => !prev);
            }
        } catch (error) {
            console.error('Failed to add shareholder:', error);
            // Optionally, you can handle the error more explicitly here, e.g., show an alert or notification to the user
        }
    };


    const handleUpdateShareHolder = async (updatedShareHolder) => {
        try {
            const response = await updateShareHolder(updatedShareHolder.id, updatedShareHolder);
            if (response.status === 200) {
                setRefreshTrigger(prev => !prev);
                setEditingShareHolder(null);
            }
        } catch (error) {
            console.error('Failed to update shareholder:', error);
            // Again, you could manage error notifications or other UI responses here
        }
    };


    const handleDeleteShareHolder = async (id) => {
        try {
            await removeShareHolder(id);
            setRefreshTrigger(prev => !prev);
        } catch (error) {
            console.error('Failed to delete shareholder:', error);
            // This is a good place to notify the user that the operation failed
        }
    };

    const convertToPersianCaption = (caption) => {
        const persianCaptions = {
            REGISTERED: "با نام",
            BEARER: "بی نام",
        };
        return persianCaptions[caption] || caption;
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
        {
            key: 'shareType',
            title: 'نوع سهم',
            width: '10%',
            sortable: true,
            searchable: true ,
            render: (item) => convertToPersianCaption(item.shareType),
            type : 'select',
            options : [{ value: 'REGISTERED', label: 'با نام' },{ value: 'BEARER', label: 'بی نام' }]
        },
        { key: 'fileName', title: 'نام فایل', width: '10%', sortable: true, searchable: true },
        { key: 'fileName', title: 'فایل', width: '2%', render : (item) => item.fileName !== null  ? <IconAttach/> : '' },
    ];



    async function downloadExcelFile() {
        await http.get(`/shareholders/export/${Number(companyId)}`, { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "shareholders.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }
    const onUploadFile = async (id,formData) => {
        return await http.post(`/shareholders/${id}/upload-file`, formData)
            .then(response => {
                if (response.status === 201){
                    setRefreshTrigger(!refreshTrigger);
                    return response;
                }}
            )
    }
    const onFileDelete = async (id) => {
        return await http.delete(`/shareholders/${id}/delete-file`)
            .then((response) => {
                if (response.status === 204) {
                    setRefreshTrigger(!refreshTrigger);
                    return response;
                }
            })
    };

    return (
        <div className="table-container">
            <ButtonContainer>
                <Button
                    variant="primary"
                    onClick={() => setShowModal(true)}
                >
                    جدید
                </Button>
                <Button variant="success" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
            </ButtonContainer>
            <div>
                <CreateShareHolderForm
                    onAddShareHolder={handleAddShareHolder}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    companyId={Number(companyId)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={getAllShareHolders}
                onEdit={(shareholder) => {
                    setEditingShareHolder(shareholder);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteShareHolder}
                refreshTrigger={refreshTrigger}
            />

            {editingShareHolder && (
                <EditShareHolderForm
                    shareholder={editingShareHolder}
                    show={showEditModal}
                    onUpdateShareHolder={handleUpdateShareHolder}
                    onHide={() => {
                        setEditingShareHolder(null);
                        setEditShowModal(false);
                    }}
                    onUploadFile={onUploadFile}
                    onFileDelete={onFileDelete}
                />
            )}
        </div>
    );
};

export default ShareHolders;
