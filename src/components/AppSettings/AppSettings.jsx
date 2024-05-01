import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import useHttp from "../../hooks/useHttp";
import {bodyStyle, inputStyle, labelStyle, titleStyle} from "../../settings/styles";
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import {Alert} from "react-bootstrap";
import LoadingDataErrorPage from "../../utils/formComponents/LoadingDataErrorPage";



function AppSettings() {
    const http = useHttp();
    const [initialSettings, setInitialSettings] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
    const { register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors,isDirty } } = useForm({
    });

    useEffect(() => {
        http.get('/app-settings')
            .then(response => {
                const fields = [
                    'maxUploadFileSize',
                    'vsphereUrl',
                    'vsphereUsername',
                    'vspherePassword'
                ];
                fields.forEach(field => setValue(field, response.data[field]));
                setInitialSettings(response.data);
            })
            .catch(error => {
                if (error.response && error.request){
                    setAlert({ show: true, message: "خطا در اتصال به سرور.", type: "danger" });
                    setTimeout(() => {
                        setAlert({ show: false });
                    }, 3000);
                }
                else{
                    console.error('Error fetching app settings:', error);
                }

            });
    }, [setValue]);

    const onSubmit = data => {
        setIsEditing(true)
        http.put('/app-settings', data)
            .then(response => {
                if (response.status === 200){
                    setIsEditing(false);
                    const fields = [
                        'maxUploadFileSize',
                        'vsphereUrl',
                        'vsphereUsername',
                        'vspherePassword'
                    ];
                    fields.forEach(field => setValue(field, response.data[field]));
                    setInitialSettings(response.data);
                    setAlert({ show: true, message: "بروز رسانی با موفقیت انجام شد.", type: "success" });
                    setTimeout(() => {
                        setAlert({ show: false });
                    }, 3000);
                }
            })
            .catch(error => {
                setIsEditing(false);
                console.error('Error updating settings:', error);
            });
    };
    const onCancel = () => {
        reset(initialSettings);
    };

    return (
        (initialSettings === undefined)
            ? <LoadingDataErrorPage/>
            : <div  className="container mx-auto p-4 rounded shadow-md max-w-md mt-10">
                <ButtonContainer>
                    <span style={{...titleStyle,color:"dodgerblue",fontSize:"0.9rem"}}>تنظیمات نرم افزار</span>
                </ButtonContainer>
                <form style={bodyStyle} className="mt-4 border border-1 rounded" onSubmit={handleSubmit(onSubmit)}>
                    <label style={labelStyle}>حداکثر حجم بارگذاری:</label>
                    <input style={inputStyle} {...register("maxUploadFileSize")} />
                    <p>{errors.maxUploadFileSize?.message}</p>

                    <label style={labelStyle}>آدرس vsphere:</label>
                    <input style={inputStyle}  {...register("vsphereUrl")} />
                    <p>{errors.vsphereUrl?.message}</p>

                    <label style={labelStyle}> نام کاربری vsphere :</label>
                    <input style={inputStyle}  {...register("vsphereUsername")} />
                    <p>{errors.vsphereUsername?.message}</p>

                    <label style={labelStyle}>پسورد vsphere:</label>
                    <input style={inputStyle}  {...register("vspherePassword")} />
                    <p>{errors.vspherePassword?.message}</p>

                    <Button variant={isEditing ? "secondary" : "success"} type="submit">
                        {isEditing ? "در حال بروزرسانی..." : "بروز رسانی"}
                    </Button>
                    {isDirty && <Button variant="warning" onClick={onCancel}>لغو تغییرات</Button>}
                </form>
                {alert.show && (
                   <React.Fragment>
                       <hr/>
                       <Alert style={{ fontFamily: "IRANSans", fontSize: "0.8rem" }} variant={alert.type}>
                           {alert.message}
                       </Alert>
                   </React.Fragment>
                )}
            </div>
    );
}

export default AppSettings;
