import React, { useState, useEffect } from 'react';
import { extensionToType } from "../../../utils/documentUtils";
import useHttp from "../../../hooks/useHttp";
import {useNavigate} from "react-router-dom";

const DropZoneUploader = ({ personId, companyId, letterId, refreshTrigger, setRefreshTrigger, onHide }) => {
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [fileSizeError, setFileSizeError] = useState(false);
    const [maxUploadFileSize, setMaxUploadFileSize] = useState(null);
    const http = useHttp();
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        http.get('/app-settings/max-upload-file-size')
            .then(response => {
                if (response && response.status === 403){
                    navigate("/login")
                }
                setMaxUploadFileSize(response.data);
            })
            .catch(error => {
                console.error('Error fetching max upload file size:', error);
                if (error.response && error.response.status === 403){
                    navigate("/login")
                }

            });
    }, []);

    const sendFile = async (file) => {
        if (uploadComplete) setUploadComplete(false);
        if (maxUploadFileSize && file.size > maxUploadFileSize) {
            setFileSizeError(true);
            return;
        }
        setFileSizeError(false);
        const formData = new FormData();

        const documentType = extensionToType[file.name.split('.').pop()];
        const fileExtension = file.name.split('.').pop();
        const documentName = file.name;

        formData.append('documentName', documentName);
        formData.append('documentType', documentType);
        formData.append('fileExtension', fileExtension);
        formData.append('documentFile', file);
        if (personId !== undefined)
            formData.append('personId', personId);
        if (companyId !== undefined)
            formData.append('companyId', companyId);
        if (letterId !== undefined)
            formData.append('letterId', letterId);

        try {
            await http.post('/documents', formData, {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const progress = Math.round((loaded * 100) / total);
                    setUploadProgress(progress);
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setUploadComplete(true);
            setRefreshTrigger(!refreshTrigger);
            setUploadProgress(null);
            console.log('File upload successful');
            setTimeout(() => {
                setUploadComplete(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading file:', error);
            if (error.response && error.response.status === 403) {
                navigate('/login'); // Redirect to login page on 403 error
            }
        }
    };

    const handleCancelClick = () => {
        if (onHide) {
            onHide();
        }
    };

    const handleFileSelect = (event) => {
        const filesArray = event.target.files;
        for (let i = 0; i < filesArray.length; i++) {
            sendFile(filesArray[i]);
        }
    };

    return (
        <div>
            <input
                type="file"
                id="fileElem"
                accept="*/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />
            <label className="btn btn-primary"
                   style={{
                       cursor: 'pointer',
                       fontFamily: 'IRANSans',
                       fontSize: '0.7rem',
                   }}
                   htmlFor="fileElem">انتخاب..</label>
            {onHide && <button style={{
                cursor: 'pointer',
                fontFamily: 'IRANSans',
                fontSize: '0.7rem',
            }} onClick={() => {
                handleCancelClick();
                setUploadProgress(null)
                setDragging(false)
                setUploadComplete(false)
                setFileSizeError(false);
            }} className="btn btn-warning btn-sm" type="button">
                انصراف
            </button>}
            {uploadProgress !== null && (
                <div style={{
                    cursor: 'pointer',
                    fontFamily: 'IRANSans',
                    fontSize: '0.7rem',
                }}>
                    <p>در حال بارگذاری : {uploadProgress}%</p>
                    <progress value={uploadProgress} max="100" />
                </div>
            )}
            {uploadComplete && (
                <strong style={{ color: 'green', fontFamily: 'IRANSans', fontSize: "0.7rem" }}>فایل با موفقیت بارگذاری شد.!</strong>
            )}
            {fileSizeError && (
                <strong style={{ color: 'red', fontFamily: 'IRANSans', fontSize: "0.7rem" }}>خطا: حداکثر اندازه فایل باید {parseFloat((maxUploadFileSize / (1024 * 1024)).toFixed(2))} مگابایت باشد.</strong>
            )}
        </div>
    );
};

export default DropZoneUploader;
