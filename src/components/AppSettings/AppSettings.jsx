import React, { useState, useEffect } from 'react';
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";

const AppSettings = () => {
    const http = useHttp();
    const [maxUploadFileSizeMB, setMaxUploadFileSizeMB] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        http.get('/settings/max-upload-file-size')
            .then(response => {
                // Convert bytes to Megabytes for display
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
        // Convert Megabytes to bytes and round to the nearest whole number before submitting
        const maxUploadFileSizeBytes = Math.min(Math.round(parseFloat(maxUploadFileSizeMB) * 1024 * 1024), 10 * 1024 * 1024); // Limit to 10 MB
        http.put(`/settings/max-upload-file-size/${maxUploadFileSizeBytes}`)
            .then(() => {
                alert('تنظیمات با موفقیت به‌روزرسانی شد!');
                setIsEditing(false);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('خطا در به‌روزرسانی تنظیمات برنامه:', error);
                setIsLoading(false);
            });
    };


    return (
        <div style={{ padding: '20px', fontFamily: 'IRANSans' }}>
            <h2>تنظیمات برنامه</h2>
            {isLoading ? (
                <p>در حال بارگذاری...</p>
            ) : (
                <div>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        حداکثر اندازه فایل برای بارگذاری (مگابایت):
                        <input
                            type="number"
                            value={maxUploadFileSizeMB}
                            onChange={(e) => setMaxUploadFileSizeMB(e.target.value)}
                            style={{ marginLeft: '10px' }}
                            disabled={!isEditing}
                            step="0.01"
                            min="0"
                            max="10"
                        />
                        <span style={{ marginLeft: '5px' }}>MB</span>
                    </label>
                    {isEditing ? (
                        <Button variant="success" onClick={handleSave} style={{ cursor: 'pointer', fontFamily: 'IRANSans', fontSize: '1rem', marginLeft: '10px' }}>
                            ذخیره
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleToggleEdit} style={{ cursor: 'pointer', fontFamily: 'IRANSans', fontSize: '1rem', marginLeft: '10px' }}>
                            ویرایش
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppSettings;
