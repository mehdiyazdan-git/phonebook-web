import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap'; // Import Spinner component from react-bootstrap
import { extensionToType } from '../documentUtils';
import Button from '../Button';

function FileUploader({ onAddDocument, show, onHide, personId }) {
    const [file, setFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const handleFileSelect = () => {
        document.getElementById('fileElem').click();
    };

    const getTypeFromExtension = (extension) => {
        return extensionToType[extension.toLowerCase()] || 'نامشخص';
    };

    const handleCancel = () => {
        onHide();
        resetForm();
    };

    const resetForm = () => {
        setFile(null);
        setDocumentName('');
        setDocumentType('');
        setFileExtension('');
    };

    const handleFiles = (event) => {
        const fileList = event.target.files;
        if (!fileList.length) {
            resetForm();
        } else {
            setLoading(true)
            const selectedFile = fileList[0];
            setFile(selectedFile);
            setDocumentName(selectedFile.name);
            setFileExtension(selectedFile.name.split('.').pop());
            setDocumentType(getTypeFromExtension(selectedFile.name.split('.').pop()));
            setLoading(false)
        }
    };

    const handleSubmit = async () => {
        if (file) {
            setLoading(true); // Set loading state to true when submitting
            const formData = new FormData();
            formData.append('documentName', documentName);
            formData.append('documentType', documentType);
            formData.append('fileExtension', fileExtension);
            formData.append('documentFile', file);
            formData.append('personId', personId);

            try {
                await onAddDocument(formData);
                resetForm();
                onHide();
            } catch (error) {
                console.error('Error adding document:', error);
            } finally {
                setLoading(false); // Set loading state to false after submission
            }
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Body>
                {loading ? ( // Show spinner if loading
                    <Spinner animation="border" role="status"/>
                ) : (
                    <div>
                        <input
                            type="file"
                            id="fileElem"
                            accept="image/*,.pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.jpg,.jpeg,.png,.gif,.bmp,.csv,.txt,.zip"
                            style={{ display: 'none' }}
                            onChange={handleFiles}
                        />
                        <a href="#" onClick={handleFileSelect}>انتخاب فایل‌ها</a>
                        <div id="fileList">
                            {file ? (
                                <ul>
                                    <li>
                                        <img src={URL.createObjectURL(file)} alt={file.name} height={60} onLoad={() => URL.revokeObjectURL(file.src)} />
                                        <span style={{ direction: 'rtl', textAlign: 'right' }}>
                                            <strong>نام فایل:</strong> {file.name} <br />
                                            <strong>اندازه فایل:</strong> {file.size} بایت <br />
                                            <strong>نوع فایل:</strong> {getTypeFromExtension(file.name.split('.').pop())} <br />
                                            <strong>پسوند فایل:</strong> {file.name.split('.').pop().toUpperCase()}
                                        </span>
                                    </li>
                                </ul>
                            ) : (
                                <p>فایلی انتخاب نشده است!</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSubmit}>ثبت</Button>
                <Button variant="warning" onClick={handleCancel}>انصراف</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FileUploader;
