import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";
import { Alert } from "react-bootstrap";
import { bodyStyle, inputStyle, labelStyle } from "../../settings/styles";

const VSphereSettings = () => {
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm({ defaultValues: { vsphereUrl: "", vsphereUsername: "", vspherePassword: "" } });
    const http = useHttp();
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

    const onSubmit = (data) => {
        http.put("/settings/vsphere-settings", data)
            .then((response) => {
                if (response.status === 200) {
                    setAlert({ show: true, message: "ثبت تغییرات با موفقیت انجام شد.", type: "success" });
                    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 5000);
                    setIsEditing(false);
                } else {
                    setAlert({ show: true, message: "خطا در بروز رسانی", type: "danger" });
                    setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
                }
            })
            .catch((error) => {
                console.error("خطا در بروز رسانی:", error);
                setAlert({ show: true, message: "خطا در بروز رسانی", type: "danger" });
                setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
            });
    };

    useEffect(() => {
        http.get("/settings/vsphere-settings")
            .then((response) => {
                if (response.status === 200) {
                    setValue("vsphereUrl", response.data.vsphereUrl);
                    setValue("vsphereUsername", response.data.vsphereUsername);
                    setValue("vspherePassword", response.data.vspherePassword);
                }
            })
            .catch((error) => {
                console.error("Error retrieving settings:", error);
                setAlert({ show: true, message: "Error retrieving settings", type: "danger" });
                setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
            });
    }, []);

    return (
        <div style={bodyStyle} className="container border p-2 p-md-5 p-lg-6 p-xl-7 rounded">
            <div className="row">
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="username">
                        نام کاربری:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("vsphereUsername")}
                        placeholder="نام کاربری"
                        disabled={!isEditing}
                    />
                </div>
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="password">
                        کذر واژه:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("vspherePassword")}
                        placeholder="کلمه عبور"
                        disabled={!isEditing}
                    />
                </div>
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="url">
                         آدرس سرور:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("vsphereUrl")}
                        placeholder="آدرس سرور"
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

export default VSphereSettings;
