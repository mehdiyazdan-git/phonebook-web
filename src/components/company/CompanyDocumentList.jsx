import React, { useState, useEffect } from 'react';
import {IoCloudDownloadOutline, IoDocumentOutline} from "react-icons/io5";
import {RiDeleteBin6Line} from "react-icons/ri";
import { saveAs } from 'file-saver';
import ConfirmationModal from "../table/ConfirmationModal";
import DropZoneUploader from "../person/document/DropZoneUploader";
import {useNavigate, useParams} from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import FileTypeIcon from "../assets/icons/FileTypeIcon";

const CompanyDocumentList = ({onHide }) => {
    const {companyId} = useParams();
    const [documents, setDocuments] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const http = useHttp();
    const navigate = useNavigate();

    const deleteDocument = async (id) => {
        return await http.delete(`/documents/${id}`);
    };
    useEffect(() => {
        const fetchData = async (companyId) => {
            try {
                const response = await http.get(`/documents/by-company-id/${companyId}`);
                setDocuments(response.data);
            } catch (error) {
                navigate("/login");
            }
        };

        if (companyId) {
            fetchData(Number(companyId));
        }
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
            <div className="p-0 m-0" style={{minHeight:"200px"}}>
                <table
                    className="table table-bordered m-0 p-0 w-100 table-sm table-striped table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl"
                    style={{fontFamily: "IRANSans", fontSize: "0.8rem"}}>
                    <thead style={{
                        backgroundColor: 'rgba(220,220,255,0.5)',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontFamily: "IRANSansBold"
                    }}>
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
                            <td className="flex-column">{<FileTypeIcon height="2em" width="2em" fileExtension={document.fileExtension}/>} {document.documentName}</td>
                            <td>{document.fileExtension}</td>
                            <td width="250px" className="m-0 p-0" style={{cursor: "pointer"}}>
                                <IoCloudDownloadOutline className="mx-1" fontSize={"1.3rem"} color={"green"}
                                                        onClick={() => handleDownload(document)}/>
                                <IoDocumentOutline className="mx-1" fontSize={"1.3rem"} color={"#3795ed"}
                                                   onClick={() => handleOpenInNewTab(document)}/>
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
