import React from 'react';
import * as Yup from 'yup';
import {Form} from "../../../utils/Form";
import Button from "../../../utils/Button";
import {Modal} from "react-bootstrap";
import {TextInput} from "../../../utils/formComponents/TextInput";
import {FileInput} from "../../../utils/formComponents/FileInput";
import {extensionToType} from "../../../utils/documentUtils";
import FileUploader from "../../../utils/formComponents/FileUploader";

const NewDocumentForm = ({onAddDocument, show, onHide, personId}) => {
    const validationSchema = Yup.object().shape({
        documentName: Yup.string().required('نام سند الزامیست.'),
        documentFile: Yup.mixed().required('فایل سند الزامیست.'),
    });
    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result)
        };
        reader.readAsDataURL(new Blob(Array.from(file.toString())));
    })
    function getFileExtension(filePath) {
        const dotIndex = filePath.lastIndexOf('.');
        return dotIndex !== -1 ? filePath.slice(dotIndex + 1) : '';
    }
    const onSubmit = async (data) => {
        const file = data.documentFile;

        if (file) {
            console.log(data)
            const fileName = file.name;
            const fileExtension = getFileExtension(fileName);
            const documentType = extensionToType[fileExtension] || 'Other';

            // Read the file as a data URL
            const fileDataUrl = await fileToDataUri(file);

            // Prepare the document object to be sent
            const documentObject = {
                documentName: data.documentName,
                documentType,
                fileExtension,
                documentFile: fileDataUrl,
                personId: data.personId,
            };

            // Call the onAddDocument function with the document object
            console.log(documentObject);

            // Call the onHide function to hide the form
            onHide();
        } else {
            console.error('File is undefined');
        }
    };

    return (
        <Modal show={show}>
            <Modal.Header style={{backgroundColor: "rgba(63,51,106,0.6)"}}>
                <Modal.Title style={{fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff"}}>ایجادسند
                    جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    defaultValues={{
                        documentName: '',
                        documentType: '',
                        fileExtension: '',
                        documentFile: '',
                        personId: personId
                    }}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    <TextInput name={"documentName"} label={"نام فایل"}/>
                    <FileInput label={"فایل"} name="documentFile"/>
                    <FileUploader/>
                    <Button variant="success" type="submit">
                        ایجاد
                    </Button>
                    <Button onClick={onHide} variant="warning" type="button">
                        انصراف
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NewDocumentForm;
