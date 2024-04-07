import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "../../utils/Button";
import useHttp from "../../hooks/useHttp";

const FileInput = ({ label, letterId, reload }) => {
    const [selectedFileName, setSelectedFileName] = useState('فایلی انتخاب نشده است');
    const fileInputRef = useRef(null);
    const http = useHttp();

    const upload = async (formData) => {
        try {
            const res = await http.post(`/attachments/upload?letterId=${letterId}`, formData);
            console.log(res.data);
            toast.success('فایل با موفقیت بارگذاری شد.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar'
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            reload();
        } catch (error) {
            console.error('خطا در بارگذاری فایل :', error);
        }
    };

    const onFileChangeHandler = async (e) => {
        const files = e.target.files;
        const fileNames = Array.from(files).map(file => file.name);
        setSelectedFileName(fileNames.join(', ') || 'فایلی انتخاب نشده است');

        const formData = new FormData();
        formData.append('letterId', letterId);
        Array.from(files).forEach(file => formData.append('file', file));

        await upload(formData);
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
