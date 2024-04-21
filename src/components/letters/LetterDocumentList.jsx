import React, {useEffect, useState} from 'react';
import useHttp from "../../hooks/useHttp";
import {IoCloudDownloadOutline, IoDocumentOutline} from "react-icons/io5";
import {RiDeleteBin6Line} from "react-icons/ri";
import DropZoneUploader from "../person/document/DropZoneUploader";
import ConfirmationModal from "../table/ConfirmationModal";
import { saveAs } from 'file-saver';

const LetterDocumentList = ({letterId,onHide}) => {
    const [documents, setDocuments] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const http = useHttp();

    const getAllDocumentsByLetterId = async (letterId) => {
        return await http.get(`/documents/by-letter-id/${letterId}`);
    };

    const deleteDocument = async (id) => {
        return await http.delete(`/documents/${id}`);
    };

    useEffect(() => {
        getAllDocumentsByLetterId(letterId).then(r => setDocuments(r.data))
    }, []);

    useEffect(() => {
        getAllDocumentsByLetterId(letterId).then(r => setDocuments(r.data))
    }, [letterId, refreshTrigger]);

    const handleDeleteConfirm = async () => {
        if (selectedDocumentId) {
            await deleteDocument(selectedDocumentId);
            setShowConfirmationModal(false);
            setRefreshTrigger(!refreshTrigger);
            setSelectedDocumentId(null);
        }
    };

    const handleDownload = (document) => {
        http.get(`/documents/${document.id}`,{ responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, document.fileName);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    const handleOpenInNewTab = (document) => {
        http.get(`/documents/${document.id}`, {
            responseType: 'blob',
        })
            .then((response) => {
                const blobUrl = URL.createObjectURL(response.data);
                window.open(blobUrl, '_blank');
                URL.revokeObjectURL(blobUrl);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    return (
        <div className="p-0 m-0">
            <DropZoneUploader
                letterId={letterId}
                refreshTrigger={refreshTrigger}
                setRefreshTrigger={setRefreshTrigger}
                onHide={onHide}
            />
            <div style={{padding:"0",border:"1px solid #ddd",minHeight:"300px"}}>
                <table className="table table-bordered m-0" style={{fontFamily:"IRANSans",fontSize:"0.8rem"}}>
                    <thead>
                    <tr>
                        <th>شناسه</th>
                        <th>نام سند</th>
                        <th>نوع سند</th>
                        <th>عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {documents.map((document) => (
                        <tr key={document.id}>
                            <td width="50px">{document.id}</td>
                            <td>{document.documentName}</td>
                            <td>{document.fileExtension}</td>
                            <td width="250px" className="m-0 p-0" style={{cursor:"pointer"}}>
                                <IoCloudDownloadOutline className="mx-1" fontSize={"1.3rem"} color={"green"} onClick={() => handleDownload(document)} />
                                <IoDocumentOutline  className="mx-1" fontSize={"1.3rem"} color={"#3795ed"} onClick={() => handleOpenInNewTab(document)} />
                                <RiDeleteBin6Line
                                    className="mx-1"
                                    fontSize={"1.3rem"}
                                    color={"red"}
                                    onClick={() => {
                                        setSelectedDocumentId(document.id)
                                        setShowConfirmationModal(true)
                                    }}
                                >
                                </RiDeleteBin6Line>
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

export default LetterDocumentList;
