import React, { useState } from 'react';
import axios from 'axios';
import "./PersonDocumentList.css"

function PersonDocumentUpload({ personId, onUploadSuccess }) {
    const [files, setFiles] = useState({
        nationalIdFile: null,
        birthCertificateFile: null,
        cardServiceFile: null,
        academicDegreeFile: null
    });

    const handleFileChange = (event) => {
        setFiles({
            ...files,
            [event.target.name]: event.target.files[0]
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        Object.entries(files).forEach(([key, value]) => {
            if (value) {
                formData.append(key, value);
            }
        });

        try {
            await axios.post(`http://localhost:8081/api/person-documents/${personId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUploadSuccess();
        } catch (error) {
            console.error('Error uploading documents:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="person-document-upload">
            <h6 style={{ textAlign: 'right' }}>بارگذاری مدارک شخص</h6>
            <div className="custom-file mb-3">
                <input type="file" className="custom-file-input" name="nationalIdFile" onChange={handleFileChange} />
                <label className="custom-file-label" style={{ textAlign: 'right' }}>فایل کارت ملی</label>
            </div>
            <div className="custom-file mb-3">
                <input type="file" className="custom-file-input" name="birthCertificateFile" onChange={handleFileChange} />
                <label className="custom-file-label" style={{ textAlign: 'right' }}>فایل شناسنامه</label>
            </div>
            <div className="custom-file mb-3">
                <input type="file" className="custom-file-input" name="cardServiceFile" onChange={handleFileChange} />
                <label className="custom-file-label" style={{ textAlign: 'right' }}>فایل کارت پایان خدمت</label>
            </div>
            <div className="custom-file mb-3">
                <input type="file" className="custom-file-input" name="academicDegreeFile" onChange={handleFileChange} />
                <label className="custom-file-label" style={{ textAlign: 'right' }}>فایل مدرک تحصیلی</label>
            </div>
            <button type="submit" className="btn btn-primary">بارگذاری</button>
        </form>
    );
}

export default PersonDocumentUpload;
