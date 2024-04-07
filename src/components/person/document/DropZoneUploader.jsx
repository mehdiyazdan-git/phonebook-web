import React, {useState} from 'react';
import {extensionToType} from "../../../utils/documentUtils";
import useHttp from "../../../hooks/useHttp";


const DropZoneUploader = ({personId,companyId,letterId, refreshTrigger, setRefreshTrigger,onHide}) => {
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [dragging, setDragging] = useState(false);
    const http = useHttp();

    const sendFile = async (file) => {
        if (uploadComplete) setUploadComplete(false)
        const formData = new FormData();
        formData.append('documentName', file.name);
        formData.append('documentType', extensionToType[file.name.split('.').pop()]);
        formData.append('fileExtension', file.name.split('.').pop());
        formData.append('documentFile', file);
        if (personId !== undefined)
        formData.append('personId', personId);
        if (companyId !== undefined)
        formData.append('companyId', companyId);
        if (letterId !== undefined)
            formData.append('letterId', letterId);

        try {
            for (let progress = 0; progress <= 100; progress += 2) {
                await new Promise(resolve => setTimeout(resolve, 50));
                setUploadProgress(progress);
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            await http.post('/documents', formData, {
                onUploadProgress: (progressEvent) => {
                    const {loaded, total} = progressEvent;
                    const progress = Math.round((loaded * 100) / total);
                    setUploadProgress(progress);
                },
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
        }
    };
    const handleCancelClick = () => {
        if (onHide !== null){
            onHide()
        }
    }

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        const filesArray = event.dataTransfer.files;
        for (let i = 0; i < filesArray.length; i++) {
            sendFile(filesArray[i]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleFileSelect = (event) => {
        const filesArray = event.target.files;
        for (let i = 0; i < filesArray.length; i++) {
            sendFile(filesArray[i]);
        }
    };

    return (
        <div>
            <div
                id="dropzone"
                style={{
                    margin: '2px',
                    width: '50%',
                    height: '150px',
                    border: dragging ? '2px solid blue' : '1px dotted grey',
                    textAlign: 'center',
                    lineHeight: '150px',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    fontFamily: 'IRANSans',
                    fontSize: '0.9rem',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {dragging ? 'اینجا فایل را بکشید و رها کنید' : 'فایل را بکشید و در اینجا رها کنید'}

            </div>
            <input
                type="file"
                id="fileElem"
                accept="*/*"
                style={{display: 'none'}}
                onChange={handleFileSelect}
            />
            <label className="btn btn-primary"
                   style={{
                       cursor: 'pointer',
                       fontFamily: 'IRANSans',
                       fontSize: '0.7rem',
                   }}
                   htmlFor="fileElem">انتخاب..</label>
            <button style={{
                cursor: 'pointer',
                fontFamily: 'IRANSans',
                fontSize: '0.7rem',
            }} onClick={() => {
                handleCancelClick();
                setUploadProgress(null)
                setDragging(false)
                setUploadComplete(false)
            }} className="btn btn-warning btn-sm" type="button">
                انصراف
            </button>
            {uploadProgress !== null && (
                <div style={{
                    cursor: 'pointer',
                    fontFamily: 'IRANSans',
                    fontSize: '0.7rem',
                }}>
                    <p>در حال بارگذاری : {uploadProgress}%</p>
                    <progress value={uploadProgress} max="100"/>
                </div>
            )}
            {uploadComplete && (
                <p style={{color: 'green', fontFamily: 'IRANSans',fontSize:"0.7rem"}}>فایل با موفقیت بارگذاری شد.!</p>
            )}
        </div>
    );
};

export default DropZoneUploader;
