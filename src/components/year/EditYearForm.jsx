import React from 'react';
import { Modal } from 'react-bootstrap';
import { Form } from '../../utils/Form';
import { TextInput } from '../../utils/formComponents/TextInput';
import * as yup from 'yup';
import { useYupValidationResolver } from '../../hooks/useYupValidationResolver';
import Button from '../../utils/Button';

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

    const onSubmit = (data) => {
        onUpdateYear(data);
        onHide(); // Hide the modal after submitting
    };

    return (
        <Modal size={'lg'} show={show}>
            <Modal.Header style={{ backgroundColor: 'rgba(63,51,106,0.6)' }}>
                <Modal.Title style={{ fontFamily: 'IRANSansBold', fontSize: '0.8rem', color: '#fff' }}>
                    ویرایش سال
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'rgba(240,240,240,0.3)' }}>
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
            </Modal.Body>
        </Modal>
    );
};

export default EditYearForm;
