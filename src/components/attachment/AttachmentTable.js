import React, {useEffect, useState} from 'react';
import { saveAs } from 'file-saver';
import {IoCloudDownloadOutline, IoDocumentOutline} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import FileInput from "./FileInput";
import Attachment from "../../services/attachmentService";
import {IPADDRESS, PORT} from "../../services/conntectionParams";

const AttachmentTable = ({letterId}) => {
    const [attachments, setAttachments] = useState([]);

    const reloadAttachments = async () => {
        return await Attachment.crud.getAllAttachments(letterId).then(res => setAttachments(res.data));
    };

    useEffect(() => {
        async function loadAttachments() {
            return await Attachment.crud.getAllAttachments(letterId);
        }
        loadAttachments().then(res => setAttachments(res.data));
    }, [letterId]);

    const handleDownload = (attachment) => {
        const downloadUrl = `http://${IPADDRESS}:${PORT}/api/attachments/download/${attachment.id}`;
        fetch(downloadUrl)
            .then(response => response.blob())
            .then(blobData => {
                saveAs(blobData, attachment.fileName);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };

    const handleOpenInNewTab = (attachment) => {
        const downloadUrl = `http://${IPADDRESS}:${PORT}/api/attachments/download/${attachment.id}`;
        fetch(downloadUrl)
            .then(response => response.blob())
            .then(blobData => {
                const blobUrl = URL.createObjectURL(blobData);
                window.open(blobUrl, '_blank');
                URL.revokeObjectURL(blobUrl);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };

    const handleDelete = async (attachmentId) => {
        try {
            Attachment.crud.removeAttachment(attachmentId).then(response => {
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
                <FileInput reload={reloadAttachments} letterId={letterId} label="انتخاب فایل PDF"/>
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
