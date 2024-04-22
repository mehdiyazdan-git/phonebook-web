import React, { useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";
import { Alert } from "react-bootstrap";
import { bodyStyle, inputStyle, labelStyle } from "../../settings/styles";

const BackupSettings = () => {
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm({ defaultValues: { backupPath: "", databaseName: "" } });
    const http = useHttp();
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });


    const onSubmit = (data) => {
        http.put("/v1/database/settings/backup", data)
            .then((response) => {
                if (response.status === 200) {
                    setAlert({ show: true, message: "اطلاعات با موفقیت ثبت شد..", type: "success" });
                    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 5000);
                    setIsEditing(false);
                } else {
                    setAlert({ show: true, message: "خطا در ثبت اطلاعات...", type: "danger" });
                    setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
                }
            })
            .catch((error) => {
                console.error("خطا در ثبت اطلاعات : ", error);
                setAlert({ show: true, message: "Error updating backup settings", type: "danger" });
                setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
            });
    };

    useEffect(() => {
        http.get("/v1/database/settings/backup")
            .then((response) => {
                if (response.status === 200) {
                    setValue("backupPath", response.data.backupPath);
                    setValue("databaseName", response.data.databaseName);
                }
            })
            .catch((error) => {
                console.error("Error retrieving backup settings:", error);
                setAlert({show: true, message: "Error retrieving backup settings", type: "danger"});
                setTimeout(() => setAlert({show: false, message: "", type: "danger"}), 5000);
            });
    }, []);

    return (
        <div style={{...bodyStyle,minHeight:"290px"}} className="container border p-4 p-md-5 p-lg-6 p-xl-7 rounded">
            <div className="row">
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="backupPath">
                        مسیر ذخیر فایل پشتیبان:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("backupPath")}
                        placeholder="مسیر ذخیره"
                        disabled={!isEditing}
                    />
                </div>
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="databaseName">
                        نام بانک اطلاعاتی:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("databaseName")}
                        placeholder="نام بانک اطلاعاتی"
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
        </div>
    );
};

export default BackupSettings;
