import React, {useEffect, useState} from 'react';
import { saveAs } from 'file-saver';
import {IoCloudDownloadOutline, IoDocumentOutline} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import FileInput from "./FileInput";
import useHttp from "../../hooks/useHttp";


const AttachmentTable = ({letterId}) => {
    const [attachments, setAttachments] = useState([]);
    const http = useHttp();

     const getAllAttachments = async (letterId) => {
        return await http.get(`/attachments/all-by-letter-id/${letterId}`);
    };
     const handleReload = async () => {
         return await getAllAttachments().then(data => setAttachments(data))
     }

     const getAttachmentById = async (id) => {
        return await http.get(`/attachments/${id}`).then((response) => response.data);
    };

     const createAttachment = async (data) => {
        return await http.post("/attachments", data);
    };



     const removeAttachment = async (id) => {
        return await http.delete(`/attachments/${id}`);
    };

    useEffect(() => {
        getAllAttachments(letterId).then(res => setAttachments(res.data));
    }, [letterId]);

    const handleDownload = (document) => {
        http.get(`/attachments/download/${document.id}`,{ responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, document.fileName);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    const handleOpenInNewTab = (document) => {
        http.get(`/attachments/download/${document.id}`, {
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

    const handleDelete = async (attachmentId) => {
        try {
            removeAttachment(attachmentId).then(response => {
                if (response.status === 204) {
                    setAttachments((prevAttachments) =>
                        prevAttachments.filter((attachment) => attachment.id !== attachmentId)
                    );
                    console.log('Attachment deleted successfully.');
                } else {
                    console.error('Failed to delete attachment:', response.statusText);
                }
            })
        } catch (error) {
            console.error('Error deleting attachment:', error.message);
        }
    };

    return (
        <div style={{border: "1px #ccc solid",
                    borderRadius: "4px",
                    padding: "10px",
                    fontFamily: "IRANSans",
                    fontSize : "0.7rem",
                    margin : "1rem"
        }} className="container mt-2">
            <h6 className="label">لیست پیوست</h6>
            <div className="row m-1">
                <FileInput reload={handleReload} letterId={letterId} label="انتخاب فایل PDF"/>
            </div>
            {attachments.length === 0 ? (
                <p>بدون ضمیمه پیوست.</p>
            ) : (
                <table className="table table-bordered table-responsive">
                    <thead>
                    <tr>
                        <th className="label">ردیف</th>
                        <th className="label">نام پیوست</th>
                        <th className="label">دانلود /مشاهده/ حذف </th>
                    </tr>
                    </thead>
                    <tbody>
                    {attachments.map((attachment) => (
                        <tr key={attachment.id}>
                            <td>{attachment.id}</td>
                            <td>{attachment.fileName}</td>
                            <td>
                                <IoCloudDownloadOutline className="mx-1" fontSize={"1.3rem"} color={"green"} onClick={() => handleDownload(attachment)} />
                                <IoDocumentOutline  className="mx-1" fontSize={"1.3rem"} color={"#3795ed"} onClick={() => handleOpenInNewTab(attachment)} />
                                {attachment.deletable &&
                                    <RiDeleteBin6Line
                                    className="mx-1"
                                    fontSize={"1.3rem"}
                                    color={ attachment.deletable ? "red" : "lightGray" }
                                    onClick={() => handleDelete(attachment.id)}
                                    /> }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AttachmentTable;
