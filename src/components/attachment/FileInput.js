import React, { useRef, useState } from 'react';
import Attachment from '../../services/attachmentService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "../../utils/Button";

const FileInput = ({ label, letterId, reload }) => {
    const [selectedFileName, setSelectedFileName] = useState('فایلی انتخاب نشده است');
    const fileInputRef = useRef(null);

    const onFileChangeHandler = (e) => {
        const files = e.target.files;
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        setSelectedFileName(fileNames.join(', ') || 'فایلی انتخاب نشده است');

        const formData = new FormData();
        formData.append('letterId', letterId);
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        Attachment.crud.upload(formData)
            .then(res => {
                console.log(res.data);
                toast.success('فایل با موفقیت بارگذاری شد.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'foo-bar'
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                reload();
            })
            .catch(error => {
                console.error('خطا در بارگذاری فایل :', error);
            });
    };

    const onButtonClickHandler = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="row mt-1" style={{ fontSize: "0.7rem" }}>
            <div className="col m-1">
                <label className="label">{label}</label>
                <div className="custom-file-upload">
                    <input
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        type="file"
                        className="form-control"
                        name="file"
                        multiple
                        onChange={onFileChangeHandler}
                    />
                    <Button onClick={onButtonClickHandler} variant={"primary"}>
                        {`انتخاب فایل`}
                    </Button>
                    <span className="file-upload-text">{selectedFileName}</span>
                </div>
                <ToastContainer toastStyle={{ fontFamily: "IRANSans" }} />
            </div>
        </div>
    );
};

export default FileInput;
