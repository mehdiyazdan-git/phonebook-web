import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "../Input";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal} from 'react-bootstrap';
import Button from "../../utils/Button";

const NewSenderForm = ({ onAddSender,show,onHide }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('نام الزامیست.'),
        phoneNumber: Yup.string().required('شماره تلفن الزامیست.'),
        address: Yup.string().required('آدرس الزامیست.'),
        letterPrefix: Yup.string().required('پیشوند شماره نامه الزامیست.'),
    });
    const { register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleCancel = (e) => {
      e.preventDefault();
      reset();
      onHide();
    }

    const onSubmit = async (data) => {
        try {
            await onAddSender(data);
            reset();
            onHide();
        } catch (error) {
            console.error('Error adding sender:', error);
        }
    };

    return (
        <>


            <Modal
                size={"lg"}
                show={show}
                centered
                contentClassName="custom-modal-content"
            >
                <Modal.Header>
                    <Modal.Title style={{fontFamily:"IRANSansBold",fontSize:"1rem"}}>ایجاد شرکت جدید</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-3">
                            <div className="row mt-1">
                                <div className="col m-1">
                                    <Input name="name" register={register} label="نام:" errors={errors} />
                                </div>
                                <div className="col m-1">
                                    <Input name="phoneNumber" register={register} label="شماره تلفن" errors={errors} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col m-1">
                                    <Input name="address" register={register} label="آدرس" errors={errors} />
                                </div>
                                <div className="col m-1">
                                    <Input name="letterPrefix" register={register} label="پیشوند شماره نامه" errors={errors} />
                                </div>
                            </div>
                        </div>
                        <Button variant="primary" type="submit" className="mt-3">
                            ایجاد
                        </Button>
                        <Button variant="warning" onClick={handleCancel} className="mt-3 mx-2">
                            برگشت
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NewSenderForm;
