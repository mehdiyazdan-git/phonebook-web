import React from 'react';
import { saveAs } from 'file-saver';
import useHttp from "../../hooks/useHttp";
import Button from "../Button";

const DownloadTemplate = ({ downloadUrl, buttonLabel, fileName }) => {
    const http = useHttp();

    const handleDownload = async () => {
        try {
            await http.get(downloadUrl, { responseType: 'blob' })
                .then((response) => response.data)
                .then((blobData) => {
                    saveAs(blobData, fileName);
                });
        } catch (error) {
            console.error('خطا در بارگیری فایل:', error);
            alert('خطا در بارگیری فایل.');
        }
    };

    return (
        <Button variant={"success"} type="button" onClick={handleDownload}>{buttonLabel}</Button>
    );
};

export default DownloadTemplate;
