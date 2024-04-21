import React, {useEffect, useState} from 'react';
import { Alert } from "react-bootstrap";
import { saveAs } from 'file-saver';
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";
import ConfirmationModal from "../table/ConfirmationModal";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";

const FileComponent = ({ taxPaymentSlip, onUploadFile, onFileDelete,downloadUrl }) => {
    const [file, setFile] = useState(null);
    const  [ fileName,setFileName] = useState(taxPaymentSlip.fileName);
    const [maxUploadFileSize, setMaxUploadFileSize] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(!!taxPaymentSlip.fileName);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    const http = useHttp();
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);

    useEffect(() => {
        http.get('/settings/max-upload-file-size')
            .then(response => {
                console.log("file-size" , response.data)
                setMaxUploadFileSize(response.data);
            })
            .catch(error => {
                console.error('Error fetching max upload file size:', error);
            });
    }, [http]);
    // update fileName on form load
    useEffect(() => {
        setFileName(taxPaymentSlip.fileName);
    }, [taxPaymentSlip]);

    const clearMessage = (duration = 5000) => {
        setTimeout(() => {
            setMessage('');
            setVariant('');
        }, duration);
    };

    const FileInput = () => {
        const onChange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {  // Make sure a file is actually selected
                setFile(selectedFile);
                const fileNameParts = selectedFile.name.split('.');
                const baseFileName = fileNameParts.join('.');
                setFileName(baseFileName);
            }
        };
        return (
            <div>
                <label style={{
                    margin:"0",
                    padding:"0",
                    backgroundColor:"transparent",
                    border:"none",
                    fontFamily: "IRANSans",
                    fontSize: "0.8rem",
                    cursor:"pointer"
                }}
                       htmlFor={"file-input"}
                       className="d-flex flex-row align-items-center">
                   <IconAddCircleLine fontSize={"1.7rem"} />
                    <input id={"file-input"} hidden={true} type="file" accept={"*/*"} onChange={onChange} />
                </label>
                {fileName && <span className="mx-2" style={{width:'200px'}}>{fileName}</span>}
            </div>
        );
    };

    const UploadButton = () => {
        const handleFileUpload = async () => {
            if (!file) {
                setMessage('فایلی انتخاب نشده است.');
                setVariant('danger');
                clearMessage(); // Use helper function
            } else if (file.size > maxUploadFileSize) {
                setMessage('حجم فایل بیشتر از حد مجاز است.'); // Specify the limit if possible, e.g., "1 MB"
                setVariant('danger');
                clearMessage();
            } else {
                const formData = new FormData();
                formData.append("file", file);
                formData.append('fileName', fileName);
                formData.append('fileExtension', file.name.split('.').pop());

                const response = await onUploadFile(taxPaymentSlip.id, formData);

                if (response.status === 201) {
                    setMessage('فایل با موفقیت آپلود شد.');
                    setVariant('success');
                    setFileUploaded(true);
                    setFile(null);
                    clearMessage(); // Use helper function
                } else {
                    setMessage('آپلود فایل با خطا مواجه شد.');
                    setVariant('danger');
                    console.error('Upload failed with status:', response.status);
                    clearMessage(); // Use helper function
                }
            }
        };

        return (
            <Button
                onClick={handleFileUpload}
                variant="primary"
                style={{ fontFamily: "IRANSans", fontSize: "0.7rem" }}
            >
                بارگذاری
            </Button>
        );
    };
    useEffect(() => {
        setFileUploaded(!!taxPaymentSlip.fileName);
    }, [taxPaymentSlip])


    const FileDownloadButton = () => {
        const downloadFile = (document) => {
            http.get(downloadUrl,{ responseType: 'blob' })
                .then((response) => response.data)
                .then((blobData) => {
                    saveAs(blobData, document.fileName);
                })
                .catch((error) => {
                    console.error('Error downloading file:', error);
                });
        };
        return (
            <Button
                onClick={downloadFile}
                variant="secondary"
                style={{ fontFamily: "IRANSans", fontSize: "0.7rem" }}
            >
                دانلود
            </Button>
        );
    };


    const FileDeleteButton = () => {
        const handleFileDelete = async () => {
            const response = await onFileDelete(taxPaymentSlip.id);
            if (response.status === 204) {
                setMessage('فایل با موفقیت حذف شد.');
                setVariant('success');
                setFileUploaded(false);
                setFileName(null);
                setFile(null);

                setTimeout(() => {
                    setMessage('');
                    setVariant('');
                }, 5000);
            } else {
                setMessage('حذف فایل با خطا مواجه شد.');
                setVariant('danger');

                setTimeout(() => {
                    setMessage('');
                    setVariant('');
                }, 5000);
            }
        };
        return (
            <>
                <Button
                onClick={() => setShowConfirmationModal(true)}
                variant="danger"
                style={{fontFamily: "IRANSans", fontSize: "0.7rem"}}>
                    حذف
                </Button>
                <ConfirmationModal
                    show={showConfirmationModal}
                    handleClose={() => setShowConfirmationModal(false)}
                    handleConfirm={handleFileDelete}
                />
            </>
        )
    }

    const FileName = () => {
        return (
            <span
                className="d-flex justify-content-center align-items-center"
                style={{ fontFamily: "IRANSans", fontSize: "0.8rem" }}
            >
                {<strong style={{
                    height:"40px",
                    width:"200px",
                    border:"1px solid #ccc",
                    borderRadius:"4px",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"}}
                >
                    {fileName}
                </strong>}
            </span>
        );
    };

    const FileButtons = () => {
        return (
            <div className="d-flex justify-content-start align-items-center mb-3">
                <FileName />
                <FileDownloadButton />
                <FileDeleteButton />
            </div>
        );
    };

    return (
        <div className="mt-0 p-0 d-flex flex-column" >
            <div style={{
                fontFamily: "IRANSans",
                fontSize: "0.8rem",
                minHeight:"200px",
                border:"1px solid #ccc",
                borderRadius:"4px",
                marginTop:"10px",
                padding:"10px" }}>
                {!fileUploaded && (
                    <div  className="d-flex flex-row align-items-center" style={{ fontFamily: "IRANSans", fontSize: "0.8rem" }}>
                        <FileInput />
                        <UploadButton />
                    </div>
                )}
                {fileUploaded && (
                    <FileButtons />
                )}
                {message.length > 0 && (
                    <Alert style={{ fontFamily: "IRANSans", fontSize: "0.7rem" }} show={message.length > 0} variant={variant}>{message}</Alert>
                )}
            </div>
        </div>
    );
};

export default FileComponent;
