import React, { useState, useEffect } from 'react';
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";
import './AppSettings.css';
import {Alert} from "react-bootstrap";

const AppSettings = () => {
    const http = useHttp();
    const [maxUploadFileSizeMB, setMaxUploadFileSizeMB] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });


    useEffect(() => {
        http.get('/settings/max-upload-file-size')
            .then(response => {
                setMaxUploadFileSizeMB((response.data / (1024 * 1024)).toFixed(2));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('خطا در دریافت تنظیمات برنامه:', error);
                setIsLoading(false);
            });
    }, []);

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsLoading(true);
        const maxUploadFileSizeBytes = Math.round(parseFloat(maxUploadFileSizeMB) * 1024 * 1024);
        http.put(`/settings/max-upload-file-size/${maxUploadFileSizeBytes}`)
            .then(() => {
                setAlert({ show: true, message: 'تنظیمات با موفقیت به‌روزرسانی شد!', type: 'success' });
                setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
                setIsEditing(false);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('خطا در به‌روزرسانی تنظیمات برنامه:', error);
                setAlert({ show: true, message: 'خطا در به‌روزرسانی تنظیمات برنامه', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: 'danger' }), 5000);
                setIsLoading(false);
            });
    };


    return (
        <div className="app-settings-container">
            <h2 className="app-settings-title">تنظیمات برنامه</h2>
            {alert.show && (
                <Alert style={{fontFamily:"IRANSans" , fontSize:"0.8rem"}} variant={alert.type}>
                    {alert.message}
                </Alert>
            )}
            {isLoading ? (
                <p className="app-settings-loading">در حال بارگذاری...</p>
            ) : (
                <div className="app-settings-form">
                    <label className="app-settings-label">
                        حداکثر اندازه فایل برای بارگذاری (مگابایت):
                        <input
                            type="number"
                            className="app-settings-input"
                            value={maxUploadFileSizeMB}
                            onChange={(e) => setMaxUploadFileSizeMB(e.target.value)}
                            disabled={!isEditing}
                            step="0.01"
                            min="0"
                            max="10"
                        />
                        <span>MB</span>
                    </label>
                    {isEditing ? (
                        <Button
                            variant="success"
                            onClick={handleSave}
                        >
                            ذخیره
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleToggleEdit}
                        >
                            ویرایش
                        </Button>
                    )}
                </div>
            )}
        </div>
    );

};

export default AppSettings;
