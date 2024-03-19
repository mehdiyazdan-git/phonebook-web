import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./PersonDocumentList.css"

function PersonDocumentList({ personId }) {
    const [documents, setDocuments] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/person-documents/${personId}`);
                setDocuments(response.data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, [personId]);

    if (!documents) {
        return <div style={{ textAlign: 'right' }}>در حال بارگذاری...</div>;
    }

    return (
        <div className="person-document-list">
            <h6>مدارک شخص</h6>
            <table className="table">
                <thead>
                <tr>
                    <th>نوع مدرک</th>
                    <th>فایل</th>
                </tr>
                </thead>
                <tbody>
                {documents.nationalIdFile && <tr><td>کارت ملی</td><td>فایل کارت ملی</td></tr>}
                {documents.birthCertificateFile && <tr><td>شناسنامه</td><td>فایل شناسنامه</td></tr>}
                {documents.cardServiceFile && <tr><td>کارت پایان خدمت</td><td>فایل کارت پایان خدمت</td></tr>}
                {documents.academicDegreeFile && <tr><td>مدرک تحصیلی</td><td>فایل مدرک تحصیلی</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default PersonDocumentList;
