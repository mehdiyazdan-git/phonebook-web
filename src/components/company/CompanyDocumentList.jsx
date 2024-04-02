import React, { useState, useEffect } from 'react';
import {IoCloudDownloadOutline, IoDocumentOutline} from "react-icons/io5";
import {RiDeleteBin6Line} from "react-icons/ri";
import { saveAs } from 'file-saver';
import ConfirmationModal from "../table/ConfirmationModal";
import DropZoneUploader from "../person/document/DropZoneUploader";
import {useParams} from "react-router-dom";
import useHttp from "../../hooks/useHttp";

const CompanyDocumentList = ({onHide }) => {
    const {companyId} = useParams();
    const [documents, setDocuments] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const http = useHttp();

    const deleteDocument = async (id) => {
        return await http.delete(`/documents/${id}`);
    };


    useEffect(() => {
        const fetchData = async (companyId) => {
            const response = await http.get(`/documents/${companyId}`);
            setDocuments(response.data);
        };
        fetchData(Number(companyId));
    }, [companyId, http, refreshTrigger]);

    const handleDeleteConfirm = async () => {
        if (selectedDocumentId) {
            await deleteDocument(selectedDocumentId);
            setShowConfirmationModal(false);
            setRefreshTrigger(!refreshTrigger);
            setSelectedDocumentId(null);
        }
    };

    const handleDownload = (document) => {
        const downloadUrl = `/documents/${document.id}`;
        http.get(downloadUrl,{ responseType: 'blob' })
            .then((response) => response.blob())
            .then((blobData) => {
                saveAs(blobData, document.fileName);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    const handleOpenInNewTab = (document) => {
        const downloadUrl = `/documents/${document.id}`;
        http.get(downloadUrl,{ responseType: 'blob' })
            .then((response) => response.blob())
            .then(blobData => {
                const blobUrl = URL.createObjectURL(blobData);
                window.open(blobUrl, '_blank');
                URL.revokeObjectURL(blobUrl);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };


    return (
        <div className="p-0 m-0">
            <table
                className="table table-bordered m-0"
                style={{fontFamily:"IRANSans",fontSize:"0.8rem"}}>
                <thead style={{backgroundColor:'rgba(220,220,255,0.5)',color:'#000',fontSize:'0.7rem',fontFamily:"IRANSansBold"}}>
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
            <DropZoneUploader
                companyId={companyId ? Number(companyId) : 0}
                refreshTrigger={refreshTrigger}
                setRefreshTrigger={setRefreshTrigger}
                onHide={onHide}
            />
            <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default CompanyDocumentList;
