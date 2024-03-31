
import React from 'react';
import './styles.css';
import * as Yup from "yup";
import {Modal} from "react-bootstrap";
import {Form} from "../../../utils/Form";
import {TextInput} from "../../../utils/formComponents/TextInput";
import {FileInput} from "../../../utils/formComponents/FileInput";
import Button from "../../../utils/Button"; // Import the CSS file

const UpdateDocumentForm = (document, onUpdateDocument, show, onHide) => {
  const validationSchema = Yup.object().shape({
    documentName: Yup.string().required('نام سند الزامیست.'),
    documentFile: Yup.mixed().required('فایل سند الزامیست.'),
  });

  const onSubmit = (data) => {
    // Extract file extension and document type
    const fileExtension = data.documentFile.split(".").pop();
    const documentType = data.documentFile.split(".").shift();

    // Add file extension and document type to the data object
    data.fileExtension = fileExtension;
    data.documentType = documentType;

    // Call onAddDocument and onHide
    onUpdateDocument(data);
    onHide();
  };

  return (
      <Modal show={show}>
        <Modal.Header style={{backgroundColor: "rgba(63,51,106,0.6)"}}>
          <Modal.Title style={{fontFamily: "IRANSansBold", fontSize: "0.8rem", color: "#fff"}}>ایجادسند
            جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
              defaultValues={document}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
          >
            <TextInput name={"documentName"} label={"نام فایل"}/>
            <FileInput label={"فایل"} name="documentFile" />
            <Button variant="success" type="submit">
              ویرایش
            </Button>
            <Button onClick={onHide} variant="warning" type="button">
              انصراف
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
  );
};

export default UpdateDocumentForm;
