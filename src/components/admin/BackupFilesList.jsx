import React, { useEffect, useState } from 'react';
import useHttp from "../../hooks/useHttp";
import { parseInt } from "lodash/string";
import {titleStyle} from "../../settings/styles";
import ConfirmationModal from "../table/ConfirmationModal";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import {calc} from "@chakra-ui/react";

const BackupFilesList = ({ triggered, setTriggered }) => {
    const [backupFiles, setBackupFiles] = useState([]);
    const [error, setError] = useState('');
    const [selectedFilePath, setSelectedFilePath] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const http = useHttp();

    const fetchBackupFiles = async () => {
        setIsLoading(true);
        try {
            const response = await http.get('/v1/database/backup-files');
            setBackupFiles(response.data);
            setError('');
        } catch (err) {
            console.log(err)
            setError('Error fetching backup files: ' + err.message);
            setBackupFiles([]);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteConfirm = async () => {
        if (selectedFilePath) {
            await handleDelete(selectedFilePath);
        }
    };

    const handleDelete = async (filePath) => {
        setIsLoading(true);
        try {
            const encodedFilePath = encodeURIComponent(filePath);
           const response = await http.delete(`/v1/database/backup-files?filePath=${encodedFilePath}`);
           console.log(response)
           if (response.status === 200){
               setIsLoading(false)
               setTriggered(!triggered);
               setShowConfirmationModal(false);
               setSelectedFilePath(null);
           } else {
               console.log("Error deleting file: ", response.data);
           }
        } catch (err) {
            console.log(err)
            setError('Error deleting file: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const convertToMB = (fileSize) => {
        const bytesString = fileSize.replace(" bytes", "").replace(/[۰۱۲۳۴۵۶۷۸۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/,/g, '');
        const bytes = parseInt(bytesString, 10);
        return `${(bytes).toFixed(2)} مگابایت`;
    };

    useEffect(() => {
        fetchBackupFiles();
    }, [triggered]);

    useEffect(() => {
        if (showConfirmationModal) {
            setShowConfirmationModal(true);
        }
    }, [showConfirmationModal]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="mt-4">
            <h3 style={{...titleStyle,color:"#000"}}>لیست فایل های پشتیبان</h3>
            <div style={{
                border:"1px solid #9c9c9c",
                borderRadius:"5px",
                margin:"10px 0",
                minHeight:'calc(100vh - 20em)',
            }}>
                <table
                    style={{
                    fontFamily: "IRANSans",
                    fontSize: "0.8rem",
                        cursor:"pointer"
                }} className="recipient-table border table-striped table-hover table-responsive">
                    <thead>
                    <tr className="table-header">
                        <th>نام فایل پشتیبان</th>
                        <th>حجم فایل</th>
                        <th>نوع فایل</th>
                        <th>تاریخ ایجاد</th>
                        <th>عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {backupFiles.map((file, index) => (
                        <tr key={index}>
                            <td>{file.fileName}</td>
                            <td>{convertToMB(file.fileSize)}</td>
                            <td>{file.fileType}</td>
                            <td>{file.fileCreatedDate}</td>
                            <td>
                                <button
                                    style={{
                                        padding:"0",
                                        margin:"0",
                                        backgroundColor:"transparent",
                                        border:"none",
                                }}
                                    disabled={isLoading}
                                    onClick={() => {
                                        setSelectedFilePath(file.filePath)
                                        setShowConfirmationModal(true);
                                    }}>
                                    {isLoading
                                        ? "در حال انجام..."
                                        : <IconDeleteOutline size={"1.3rem"}/>}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default BackupFilesList;
