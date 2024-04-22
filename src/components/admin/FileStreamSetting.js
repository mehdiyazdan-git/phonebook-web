import React, { useState, useEffect } from 'react';
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";
import { Alert } from "react-bootstrap";
import { bodyStyle, inputStyle } from "../../settings/styles";

const FileStreamSetting = () => {
    const http = useHttp();
    const [maxUploadFileSizeMB, setMaxUploadFileSizeMB] = useState(0);
    const [databaseSize, setDatabaseSize] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [isEditing, setIsEditing] = useState(false);

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        http.get('/settings/max-upload-file-size')
            .then(response => {
                setMaxUploadFileSizeMB((response.data / (1024 * 1024)).toFixed(2));
            })
            .catch(error => {
                console.error('Error fetching file size settings:', error);
            });

        http.get('/v1/database/database-size')
            .then(response => {
                setDatabaseSize(response.data);
            })
            .catch(error => {
                console.error('Error fetching database size:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [http]);

    const handleSave = () => {
        setIsLoading(true);
        const maxUploadFileSizeBytes = Math.round(parseFloat(maxUploadFileSizeMB) * 1024 * 1024);
        http.put(`/settings/max-upload-file-size/${maxUploadFileSizeBytes}`)
            .then(() => {
                setAlert({ show: true, message: 'Settings updated successfully!', type: 'success' });
                setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
                handleToggleEdit();
            })
            .catch(error => {
                console.error('Error updating settings:', error);
                setAlert({ show: true, message: 'Error updating settings', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: 'danger' }), 5000);
            })
            .finally(() => {
                handleToggleEdit();
            });
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div style={bodyStyle} className="border rounded p-4">
                    <label>
                        حداکثر اندازه فایل برای بارگذاری (مگابایت):
                        <input
                            type="number"
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
                    <p>
                        اندازه دیتابیس: <strong>{databaseSize.replace("MB", "مگابایت")}</strong>
                    </p>
                    <hr/>
                    {isEditing ? (
                        <Button variant="success" onClick={handleSave}>
                            ثبت
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => handleToggleEdit()}>
                            ویرایش
                        </Button>
                    )}
                    {alert.show && (
                        <Alert variant={alert.type}>
                            {alert.message}
                        </Alert>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileStreamSetting;
