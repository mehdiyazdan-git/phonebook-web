import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useHttp from "../../hooks/useHttp";
import {bodyStyle, inputStyle, labelStyle} from "../../settings/styles";
import Button from "../../utils/Button";
import {Alert} from "react-bootstrap";

const AppSettings = () => {
    const http = useHttp();
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
    const [settings, setSettings] = useState(null);
    const {
        register,
        handleSubmit,
    } = useForm();

    const fetchSettings = async () => {
        try {
            const response = await http.get('/app-settings');
            setSettings(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = async (data) => {
        data.maxUploadFileSize *= 1024 * 1024;
        try {
            const response = await http.put('/app-settings', data);
            if (response.status === 200){
                setAlert({ show: true, message: "ثبت تغییرات با موفقیت انجام شد.", type: "success" });
                setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 5000);
                setIsEditing(false);
            } else {
                setAlert({ show: true, message: "خطا در بروز رسانی", type: "danger" });
                setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
            }
        } catch (error) {
            console.error("خطا در بروز رسانی:", error);
            setAlert({ show: true, message: "خطا در بروز رسانی", type: "danger" });
            setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);


    if (!settings) {
        return <div>تنظیمات در حال بارگذاری...</div>;
    }

    const convertToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

    return (
        <div className="container border p-2 p-md-5 p-lg-6 p-xl-7 rounded">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 style={{fontFamily:"IRANSansBold",fontSize:"1.3rem"}}>تنظیمات برنامه</h2>
                <div style={{width: "600px", ...bodyStyle}}>
                    <div className="row m-1">
                        <label style={labelStyle} htmlFor="maxUploadFileSize">حداکثر اندازه فایل آپلود
                            (مگابایت):</label>
                        <input
                            style={inputStyle}
                            {...register('maxUploadFileSize', {
                                validate: (value) => value > 0 || 'باید یک عدد مثبت باشد',
                            })}
                            defaultValue={convertToMB(settings.maxUploadFileSize)}
                            type="number"
                            id="maxUploadFileSize"
                            disabled={!isEditing}
                        />

                    </div>
                    <div className="row m-1">
                        <label style={labelStyle} htmlFor="vsphereUrl">آدرس vSphere:</label>
                        <input
                            style={inputStyle}
                            {...register('vsphereUrl')}
                            defaultValue={settings.vsphereUrl}
                            type="text"
                            id="vsphereUrl"
                            disabled={!isEditing}
                        />

                    </div>
                    <div className="row m-1">
                        <label style={labelStyle} htmlFor="vsphereUsername">نام کاربری vSphere:</label>
                        <input
                            style={inputStyle}
                            {...register('vsphereUsername')}
                            defaultValue={settings.vsphereUsername}
                            type="text"
                            id="vsphereUsername"
                            disabled={!isEditing}
                        />

                    </div>
                    <div className="row m-1">
                        <label style={labelStyle} htmlFor="vspherePassword">کلمه عبور vSphere:</label>
                        <input
                            style={inputStyle}
                            {...register('vspherePassword')}
                            defaultValue={settings.vspherePassword}
                            type="password"
                            id="vspherePassword"
                            disabled={!isEditing}
                        />

                    </div>
                    <div className="row m-1">
                        <label style={labelStyle} htmlFor="backupPath">مسیر پشتیبان:</label>
                        <input
                            style={inputStyle}
                            {...register('backupPath')}
                            defaultValue={settings.backupPath}
                            type="text"
                            id="backupPath"
                            disabled={!isEditing}
                        />

                    </div>
                    <div className="row m-1">
                        <label style={labelStyle} htmlFor="databaseName">نام پایگاه داده:</label>
                        <input
                            style={inputStyle}
                            {...register('databaseName')}
                            defaultValue={settings.databaseName}
                            type="text"
                            id="databaseName"
                            disabled={!isEditing}
                        />

                    </div>
                </div>
                <hr/>
                {isEditing ? (
                    <Button variant="success" onClick={handleSubmit(onSubmit)}>
                        ثبت
                    </Button>
                ) : (
                    <Button variant="primary" onClick={() => setIsEditing(!isEditing)}>
                        ویرایش
                    </Button>
                )}
                {alert.show && (
                    <Alert style={{ fontFamily: "IRANSans", fontSize: "0.8rem" }} variant={alert.type}>
                        {alert.message}
                    </Alert>
                )}
            </form>
        </div>
    )
}
export default AppSettings;
