import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";
import { Alert } from "react-bootstrap";
import {bodyStyle, inputStyle, labelStyle} from "../../settings/styles";

const VSphereSettings = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({ defaultValues: { vsphereUrl: "", vsphereUsername: "", vspherePassword: "" } });
    const http = useHttp();
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

    const onSubmit = (data) => {
        http.put("/settings/vsphere-settings", data)
            .then((response) => {
                if (response.status === 200) {
                    setAlert({ show: true, message: "بروزرسانی با موفقیت انجام شد.", type: "success" });
                    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 5000);
                    setIsEditing(false);
                }
                else {
                    setAlert({ show: true, message: "خطا در بروزرسانی تنظیمات", type: "danger" });
                    setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
                }
            })
            .catch((error) => {
                console.error("خطا در به‌روزرسانی :", error);
                setAlert({ show: true, message: "خطا در به‌روزرسانی", type: "danger" });
                setTimeout(() => setAlert({ show: false, message: "", type: "danger" }), 5000);
            })
            .finally(() => setIsEditing(false));
    };

    const handleToggleEdit = () => setIsEditing(!isEditing);

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
                console.error("خطا در دریافت تنظیمات Vsphere:", error);
                setAlert({show: true, message: "خطا در دریافت تنظیمات Vsphere", type: "danger"});
                setTimeout(() => setAlert({show: false, message: "", type: "danger"}), 5000);
            })
            .finally(() => setIsEditing(false));
        }, []);


    const errorMessage = errors.vsphereUrl?.message || errors.vsphereUsername?.message || errors.vspherePassword?.message;

    return (
        <div style={bodyStyle} className="container mt-4 mt-md-5 mt-lg-6 mt-xl-7 border p-4 p-md-5 p-lg-6 p-xl-7 rounded">
            <div className="row">
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="username">
                        نام کاربری:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("vsphereUsername", { required: "نام کاربری ضروری است" })}
                        placeholder="نام کاربری"
                        disabled={!isEditing}
                    />
                    {errors.vsphereUsername && <span className="text-danger">{errorMessage}</span>}
                </div>
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="password">
                        پسورد:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("vspherePassword", { required: "پسورد ضروری است" })}
                        type="password"
                        placeholder="پسورد"
                        disabled={!isEditing}
                    />
                    {errors.vspherePassword && <span className="text-danger">{errorMessage}</span>}
                </div>
            </div>
            <div className="row">
                <div className="col m-1">
                    <label style={labelStyle} htmlFor="url">
                        آدرس Vsphere:
                    </label>
                    <input
                        style={inputStyle}
                        {...register("vsphereUrl", { required: "آدرس Vsphere ضروری است" })}
                        placeholder="vSphere آدرس"
                        disabled={!isEditing}
                    />
                    {errors.vsphereUrl && <span className="text-danger">{errorMessage}</span>}
                </div>
            </div>
            <hr/>
            {isEditing ? (
                <Button variant="success" onClick={handleSubmit(onSubmit)}>
                    ذخیره
                </Button>
            ) : (
                <Button variant="primary" onClick={handleToggleEdit}>
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
