import React, { useState, useEffect } from 'react';
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";
import './AppSettings.css';
import { Alert } from "react-bootstrap";
import VSphereSettings from "../admin/VSphereSettings";
import {bodyStyle, inputStyle} from "../../settings/styles";

const AppSettings = () => {
    const http = useHttp();
    const [maxUploadFileSizeMB, setMaxUploadFileSizeMB] = useState(0);
    const [databaseSize, setDatabaseSize] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        // Fetch maximum upload file size
        http.get('/settings/max-upload-file-size')
            .then(response => {
                setMaxUploadFileSizeMB((response.data / (1024 * 1024)).toFixed(2));
            })
            .catch(error => {
                console.error('خطا در دریافت تنظیمات برنامه:', error);
            });

        // Fetch database size
        http.get('/v1/database/database-size')
            .then(response => {
                setDatabaseSize(response.data);
            })
            .catch(error => {
                console.error('خطا در دریافت اندازه دیتابیس:', error);
            })
            .finally(() => {
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
            })
            .catch(error => {
                console.error('خطا در به‌روزرسانی تنظیمات برنامه:', error);
                setAlert({ show: true, message: 'خطا در به‌روزرسانی تنظیمات برنامه', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: 'danger' }), 5000);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div style={{border:"1px solid #9c9c9c"}} className="container mt-4 mt-md-5 mt-lg-6 mt-xl-7 border p-4 p-md-5 p-lg-6 p-xl-7 rounded">
            <h2 className="app-settings-title">تنظیمات برنامه</h2>

            <div>
                {isLoading ? (
                    <p className="app-settings-loading">در حال بارگذاری...</p>
                ) : (
                    <div style={bodyStyle} className="border p-4 p-md-5 p-lg-6 p-xl-7 rounded">
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
                                style={inputStyle}
                            />
                            <span>MB</span>
                        </label>
                        <p style={{ fontFamily: "IRANSans", fontSize: "0.8rem" }} className="app-settings-detail">
                            اندازه دیتابیس: <strong>{databaseSize.replace("MB", "مگابایت")}</strong>
                        </p>
                        <hr/>
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
                        {alert.show && (
                            <Alert style={{ fontFamily: "IRANSans", fontSize: "0.8rem" }} variant={alert.type}>
                                {alert.message}
                            </Alert>
                        )}

                    </div>
                )}
                <VSphereSettings/>
            </div>
        </div>
    );
};

export default AppSettings;
