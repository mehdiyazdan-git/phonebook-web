import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {useAuth} from "../hooks/useAuth";

const FileUploadComponent = ({ uploadUrl, allowedTypes, multiple, onSuccess, onError }) => {
    const [files, setFiles] = useState([]);
    const auth = useAuth();

    const onDrop = useCallback(acceptedFiles => {
        // Handle multiple files if allowed
        const newFiles = multiple ? acceptedFiles : [acceptedFiles[0]];
        const mappedFiles = newFiles.map(file => ({
            file,
            progress: 0,
            isUploading: false,
        }));
        setFiles(currentFiles => [...currentFiles, ...mappedFiles]);
        // You can also initiate the upload directly after dropping files
        // newFiles.forEach(file => uploadFile(file));
    }, [multiple]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: allowedTypes,
        multiple: multiple
    });

    const uploadFile = (fileObject) => {
        const formData = new FormData();
        formData.append('file', fileObject.file);

        axios.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : auth.accessToken
            },
            onUploadProgress: (progressEvent) => {
                const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                setFiles(currentFiles =>
                    currentFiles.map(f =>
                        f.file.name === fileObject.file.name ? { ...f, progress: progress, isUploading: true } : f
                    )
                );
            }
        })
            .then(response => {
                setFiles(currentFiles =>
                    currentFiles.filter(f => f.file.name !== fileObject.file.name)
                );
                if (onSuccess) {
                    onSuccess(response);
                }
            })
            .catch(error => {
                if (onError) {
                    onError(error);
                }
            });
    };

    const cancelUpload = (fileObject) => {
        // Logic to cancel the upload
        setFiles(currentFiles =>
            currentFiles.filter(f => f.file.name !== fileObject.file.name)
        );
    };

    return (
        <div className="file-upload-component">
            <div {...getRootProps()} className='dropzone'>
                <input {...getInputProps()} />
                <button>Browse...</button>
                <span> Or drop files here</span>
            </div>
            <div className="files-list">
                {files.map((fileObject, index) => (
                    <div key={index} className="file-info">
                        <span>{fileObject.file.name}</span>
                        <span>{(fileObject.file.size / 1024 / 1024).toFixed(1)} MB</span>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${fileObject.progress}%` }}></div>
                        </div>
                        <span>{fileObject.progress}%</span>
                        {fileObject.isUploading && <button onClick={() => cancelUpload(fileObject)}>Cancel</button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUploadComponent;
