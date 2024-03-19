import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import Sender from "../../services/senderService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {Input} from "../Input";
import Button from "../../utils/Button";
import SubmittingModal from "../../utils/SubmittingModal";
import ConfirmationModal from "../table/ConfirmationModal";
import FormModal from "../../utils/FormModal";
import {Alert} from "react-bootstrap";

const EditSenderForm = () => {
    const navigate = useNavigate();
    const { senderId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [success,setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedSenderId, setSelectedSenderId] = useState(null);
    const { register, handleSubmit,
        setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchSenderData = async () => {
            return  await Sender.crud.getSenderById(senderId);
        };
        fetchSenderData().then(data => {
            setValue("name", data.name);
            setValue("address", data.address);
            setValue("phoneNumber", data.phoneNumber);
            setValue("letterPrefix", data.letterPrefix);
        });
    }, [senderId, setValue]);

    const handleSenderDelete = (id) => {
        setSelectedSenderId(id);
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsSubmitting(true)
        await Sender.crud.removeSender(selectedSenderId).then(response => {
            if (response.status === 204) {
                setIsSubmitting(false)
                setErrorMessage("فرستنده با موفقیت حذف شد.");
                setShowModal(true);
                navigate(-1)
            }
        }).catch((result) => {
            console.log(result);
            setIsSubmitting(false)
            setErrorMessage(result.response.data.message);
            setShowModal(true);
        });
    }



    const onSubmit = async (data) => {
       await Sender.crud.updateSender(senderId, data)
            .then(response => {
                if (response.status === 200) {
                    setSuccess(true)
                }
            })
            .catch(error => console.error('Error updating sender:', error));
    }

    return (

            <div className="container-fluid p-3"
                 style={{
                     fontFamily: "IRANSans",
                     minHeight:"80vh",
                     border: "1px #ccc solid",
                     borderRadius: "4px",
                     padding: "10px",
                     backgroundColor : "rgba(255,255,255,0.3)"
                 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <h5 style={{fontFamily:"IRANSansBold",textAlign:"center"}}>ویرایش فرستنده</h5>
                </div>
                <div className="mt-3">
                    <div className="row mt-1">
                        <div className="col m-1">
                            <Input name="name" register={register} label="نام:"/>
                        </div>
                        <div className="col m-1">
                            <Input name="phoneNumber" register={register} label="شماره تلفن" />
                        </div>
                    </div>
                    <div className ="row">
                        <div className="col m-1">
                            <Input name="address" register={register} label="آدرس" />
                        </div>
                        <div className="col m-1">
                            <Input name="letterPrefix" register={register} label="پیشوند شماره نامه" />
                        </div>
                    </div>
                </div>
                <Button variant={"success"}  type="submit">ویرایش</Button>
                <Button variant={"warning"} onClick={() => navigate("/customers")} className="mx-2">برگشت</Button>
                <Button variant={"danger"}  onClick={() => handleSenderDelete(senderId)}>حذف</Button>
                </form>
                {success && <Alert style={{color:"#1d5f37",fontFamily:"IRANSansBold",fontSize:"0.6rem",padding:"0.25rem"}} variant="success">
                    ثبت تغییرات با موفقیت انجام شد.
                </Alert>}
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                }}>
                    <SubmittingModal loading={isSubmitting}/>
                </div>
                <ConfirmationModal
                    show={showConfirmationModal}
                    handleClose={() => setShowConfirmationModal(false)}
                    handleConfirm={handleConfirmDelete}
                />
                <FormModal show={showModal} message={errorMessage} onHide={() => setShowModal(false)}/>
            </div>
    );
};

export default EditSenderForm;
