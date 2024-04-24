import React, {useEffect, useState} from "react";
import { Alert } from "react-bootstrap";
import Button from "../../utils/Button";
import useHttp from "../../hooks/useHttp";
import BackupFilesList from "./BackupFilesList"; // Assuming a Button component is in utils

const BackupRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
    const [triggered, setTriggered] = useState(false);
    const http = useHttp();



    const handleBackupRequest = async () => {
        setIsLoading(true);
        setAlert({ show: false, message: "", variant: "" });

        try {
            const response = await http.get("/v1/database/backup");

            if (response.status === 200) {
                setTriggered(!triggered);
                setAlert({ show: true, message: response.data, variant: "success" });
                setTimeout(() => {setAlert({ show: false, message: "", variant: "" })}, 3000);
                } else {
                setAlert({ show: true, message: response.data, variant: "danger" });
                setTimeout(() => {setAlert({ show: false, message: "", variant: "" })}, 3000);
            }
        } catch (error) {
            if (error.response && error.response.data){
                console.error("خطا در ایجاد فایل پشتیبان:", error.response.data);
                setAlert({ show: true, message: error.response.data, variant: "danger" });
                setTimeout(() => {setAlert({ show: false, message: "", variant: "" })}, 3000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container border p-4 mt-4 rounded">
            <Button variant="primary" disabled={isLoading} onClick={handleBackupRequest}>
                {isLoading ? "در حال انجام..." : "ایجاد پشتیبان"}
            </Button>
            {alert.show &&
                <Alert
                    variant={alert.variant}
                    style={{
                        fontFamily:"IRANSans",
                        fontSize: "0.9rem",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        // shadow
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                >
                    {alert.message}
                </Alert>}
            <BackupFilesList triggered={triggered} setTriggered={setTriggered}/>
        </div>
    );
};

export default BackupRequest;
