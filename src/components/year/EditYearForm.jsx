import React, {useEffect} from 'react';
import { Modal } from 'react-bootstrap';
import { Form } from '../../utils/Form';
import { TextInput } from '../../utils/formComponents/TextInput';
import * as yup from 'yup';
import { useYupValidationResolver } from '../../hooks/useYupValidationResolver';
import Button from '../../utils/Button';
import useHttp from "../../hooks/useHttp";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const schema = yup.object({
    name: yup.number()
        .label('نام سال')
        .transform(v => parseInt(v, 10) || undefined) // Optional type conversion (use with caution)
        .min(1000, 'نام سال باید یک عدد 4 رقمی باشد.')
        .max(9999, 'نام سال باید یک عدد 4 رقمی باشد.')
        .required('نام سال الزامیست.'),
    startingLetterNumber: yup.number()
        .required('شروع شماره نامه الزامیست.')
        .positive('شروع شماره نامه باید یک عدد مثبت باشد.')
        .integer('شروع شماره نامه باید یک عدد صحیح باشد.'),
});

const EditYearForm = ({ year, onUpdateYear, show, onHide }) => {
    const resolver = useYupValidationResolver(schema);

    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    const http = useHttp();
    const findYearById = async (yearId) => {
        return await http.get(`/years/${yearId}`).then(r => r.data);
    }

    useEffect(() => {
        if (year.id) {
            findYearById(year.id).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
            });
        }
    }, []);


    const onSubmit = (data) => {
        onUpdateYear(data);
        onHide(); // Hide the modal after submitting
    };


    return (
        <Modal size={'lg'} show={show}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>
                    ویرایش سال
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-form">
                    <Form
                        defaultValues={year}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <TextInput name="id" label={'شناسه'} disabled={true} />
                        <TextInput name="name" label={'نام سال'} />
                        <TextInput name="startingLetterNumber" label="شروع شماره نامه" />
                        <Button variant="success" type="submit">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>
                <hr/>
               <div className="row mt-3 mb-0" style={{
                   fontFamily: 'IRANSans',
                   fontSize: '0.8rem',
                   marginBottom:0
               }}>
                   <div className="col">
                       <p>{`ایجاد : ${createByFullName}`} | {` ${createAtJalali}`}</p>
                   </div>
                   <div className="col">
                       <p>{`آخرین ویرایش : ${lastModifiedByFullName}`} | {`${lastModifiedAtJalali}`}</p>
                   </div>
               </div>

            </Modal.Body>
        </Modal>
    );
};

export default EditYearForm;
