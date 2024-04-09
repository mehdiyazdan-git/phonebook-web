import React, { useState } from 'react';
import styled from 'styled-components';
import useHttp from '../../hooks/useHttp';

const FileUpload = ({ uploadUrl }) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const http = useHttp();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('لطفاً ابتدا یک فایل انتخاب کنید.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await http.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('فایل با موفقیت آپلود شد.');
            console.log('Server response:', response.data);
        } catch (error) {
            setUploadStatus('خطا در آپلود فایل.');
            console.error('Upload error:', error.response);
        }
    };

    return (
        <Container>
            <Input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload}>آپلود</Button>
            {uploadStatus && <Status>{uploadStatus}</Status>}
        </Container>
    );
};

export default FileUpload;

const Container = styled.div`
    direction: rtl;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin: 0;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 300px;
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const Status = styled.p`
    color: #333;
`;
