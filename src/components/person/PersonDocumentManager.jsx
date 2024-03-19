// PersonDocumentManager.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './PersonDocumentUpload';
import Button from "../../utils/Button"; // Assuming you have styles defined for RTL layout

const documentFields = [
    { key: 'nationalIdFile', label: 'کارت ملی' },
    { key: 'birthCertificateFile', label: 'شناسنامه' },
    { key: 'cardServiceFile', label: 'کارت پایان خدمت' },
    { key: 'academicDegreeFile', label: 'مدرک تحصیلی' }
];

const PersonDocumentManager = ({ personId }) => {
    const [editMode, setEditMode] = useState({});

    const handleUpload = async (file, documentType) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`http://localhost:8081/api/person-documents/${personId}/${documentType}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Handle upload success, such as refreshing the list
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    const handleDelete = async (field) => {
        try {
            // Replace with your delete endpoint as necessary
            await axios.delete(`http://localhost:8081/api/person-documents/${personId}/${field}`);
            // Handle deletion success, such as refreshing the list
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const toggleEditMode = (field) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="person-document-manager">
            <table>
                <tbody>
                {documentFields.map(({ key, label }) => (
                    <tr key={key}>
                        <td>{label}</td>
                        <td>
                            {editMode[key] ? (
                                <>
                                    <input
                                        type="file"
                                        onChange={(e) => handleUpload(e.target.files[0], key)}
                                    />
                                    <Button variant={"primary"} onClick={() => toggleEditMode(key)}>بارگذاری</Button>
                                </>
                            ) : (
                                <Button  variant={"success"} onClick={() => toggleEditMode(key)}>ویرایش</Button>
                            )}
                        </td>
                        <td>
                            <Button variant={"danger"} onClick={() => handleDelete(key)}>حذف</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonDocumentManager;
