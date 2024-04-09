import React, {useState} from 'react';
import NewPersonForm from './NewPersonForm';
import EditPersonForm from './EditPersonForm';
import "./person.css";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import useHttp from "../../hooks/useHttp";
import { saveAs } from 'file-saver';
import FileUpload from "../../utils/formComponents/FileUpload";
import DownloadTemplate from "../../utils/formComponents/DownloadTemplate";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import {SiMicrosoftexcel} from "react-icons/si";
import Modal from "react-bootstrap/Modal";




const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Persons = () => {
    const [editingPerson, setEditingPerson] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);


    const getAllPersons = async (queryParams) => {
        return await http.get(`/persons?${queryParams.toString()}`).then(r => r.data);
    }
    const createPerson = async (data) => {
        return await http.post("/persons", data);
    };
    const updatePerson = async (id, data) => {
        return await http.put(`/persons/${id}`, data);
    };
    const removePerson = async (id) => {
        return await http.delete(`/persons/${id}`);
    };


    const handleAddPerson = async (newPerson) => {
        try {
            const response = await createPerson(newPerson);
            if (response.status === 201) {
                setRefreshTrigger(!refreshTrigger);
                setShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    };

    const handleUpdatePerson = async (updatedPerson) => {
       try {
           const response = await updatePerson(updatedPerson.id, updatedPerson);
           if (response.status === 200) {
               setRefreshTrigger(!refreshTrigger);
               setEditingPerson(null);
               setEditShowModal(false);
           } else {
               setErrorMessage(response.data);
               setShowErrorModal(true);
           }
       } catch (error) {
           setErrorMessage(error.response.data);
           setShowErrorModal(true);
       }
    };

    const handleDeletePerson = async (id) => {
        await removePerson(id);
        setRefreshTrigger(!refreshTrigger);
    };

    async function downloadExcelFile() {
        await http.get('/persons/download-all-persons.xlsx',{ responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "persons.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }
    const ErrorModal = ({ show, handleClose, errorMessage }) => {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body className="text-center" style={{ fontFamily: "IRANSans",fontSize: "0.8rem", padding: "20px",fontWeight: "bold"}}>
                    <div className="text-danger">{errorMessage}</div>
                    <button className="btn btn-primary btn-sm mt-4" onClick={handleClose}>
                        بستن
                    </button>
                </Modal.Body>
            </Modal>
        );
    };




    const columns = [
        {key: 'id', title: 'شناسه', width: '5%', sortable: true},
        {key: 'firstName', title: 'نام', width: '15%', sortable: true, searchable: true},
        {key: 'lastName', title: 'نام خانوادگی', width: '15%', sortable: true, searchable: true},
        {key: 'fatherName', title: 'نام پدر', width: '15%', sortable: true, searchable: true},
        {key: 'nationalId', title: 'کد ملی', width: '10%', sortable: true, searchable: true},
        {
            key: 'birthDate',
            title: 'تاریخ تولد',
            width: '10%',
            sortable: true,
            searchable: true,
            type: 'date',
            render: (item) => toShamsi(item.birthDate)
        },
        {key: 'registrationNumber', title: 'شماره شناسنامه', width: '10%', sortable: true, searchable: true},
        {key: 'postalCode', title: 'کد پستی', width: '10%', sortable: true, searchable: true},
    ];

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={"/persons/import"}/>}>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <SiMicrosoftexcel
                    onClick={downloadExcelFile}
                    size={"2.2rem"}
                    className={"m-1"}
                    color={"#41941a"}
                    type="button"
                />

                <DownloadTemplate
                    downloadUrl="/persons/template"
                    buttonLabel="فرمت بارگذاری"
                    fileName="person_template.xlsx"
                />
                <NewPersonForm
                    onAddPerson={handleAddPerson}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>
            <Table
                columns={columns}
                fetchData={getAllPersons}
                onEdit={(person) => {
                    setEditingPerson(person);
                    setEditShowModal(true);
                }}
                onDelete={handleDeletePerson}
                refreshTrigger={refreshTrigger} // Pass the refresh trigger
            />

            {editingPerson && (
                <EditPersonForm
                    person={editingPerson}
                    show={showEditModal}
                    onUpdatePerson={handleUpdatePerson}
                    onHide={() => {
                        setEditingPerson(null);
                        setEditShowModal(false);
                    }}
                />
            )}
            <ErrorModal
                show={showErrorModal}
                handleClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Persons;
