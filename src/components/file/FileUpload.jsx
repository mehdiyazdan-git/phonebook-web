import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from "../../hooks/useAuth";

const FileUpload = ({ endpoint, onUploadSuccess, onUploadError, allowedExtensions = [], maxSize = 5242880 }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const auth = useAuth();

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Validate file selection
        if (!file) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        const validExtension = allowedExtensions.length === 0 || allowedExtensions.includes(file.type.split('/')[1]);
        const fileSize = file.size;

        if (!validExtension) {
            setErrorMessage(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`);
            return;
        }

        if (fileSize > maxSize) {
            setErrorMessage(`File size exceeds limit (${Math.round(maxSize / 1048576)} MB).`);
            return;
        }

        setSelectedFile(file);
        setErrorMessage(null); // Clear any previous error messages
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`, // Replace with your actual Bearer token
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            console.log('File uploaded successfully:', response.data);
            onUploadSuccess && onUploadSuccess(response.data); // Call success callback if provided
            setSelectedFile(null);
            setUploadProgress(0);
        } catch (error) {
            console.error('Error uploading file:', error);
            setErrorMessage('An error occurred during upload. Please try again.');
            onUploadError && onUploadError(error); // Call error callback if provided
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {selectedFile && (
                <div>
                    <p>Selected file: {selectedFile.name}</p>
                    <progress value={uploadProgress} max={100} />
                    <button onClick={handleFileUpload}>Upload</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
