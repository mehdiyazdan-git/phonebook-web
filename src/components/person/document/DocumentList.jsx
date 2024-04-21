import React, { useState, useEffect } from 'react';
import DropZoneUploader from './DropZoneUploader';
import { saveAs } from 'file-saver';
import ConfirmationModal from "../../table/ConfirmationModal";
import {IoCloudDownloadOutline, IoDocumentOutline} from "react-icons/io5";
import {RiDeleteBin6Line} from "react-icons/ri";
import useHttp from "../../../hooks/useHttp";


const DocumentList = ({ personId,onHide }) => {
    const [documents, setDocuments] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const http = useHttp();

     const getAllDocumentsByPersonId = async (personId) => {
        return await http.get(`/documents/by-person-id/${personId}`);
    };

     const deleteDocument = async (id) => {
        return await http.delete(`/documents/${id}`);
    };

    useEffect(() => {
        getAllDocumentsByPersonId(personId).then(r => setDocuments(r.data))
    }, []);

    useEffect(() => {
         getAllDocumentsByPersonId(personId).then(r => setDocuments(r.data))
    }, [personId, refreshTrigger]);

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
           <div style={{padding:"0",margin:"0",overflowX:"auto",height:"400px",border:"1px solid #ddd"}}>
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
            <DropZoneUploader
                personId={personId}
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

export default DocumentList;
