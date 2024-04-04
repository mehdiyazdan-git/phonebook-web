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




const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Persons = () => {
    const [editingPerson, setEditingPerson] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
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
        const response = await createPerson(newPerson);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };

    const handleUpdatePerson = async (updatedPerson) => {
        const response = await updatePerson(updatedPerson.id, updatedPerson);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
            setEditingPerson(null);
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
        {key: 'registrationNumber', title: 'شماره ثبت', width: '10%', sortable: true, searchable: true},
        {key: 'postalCode', title: 'کد پستی', width: '10%', sortable: true, searchable: true},
    ];

    return (
        <div className="table-container">
            <span style={{fontFamily: "IRANSansBold", fontSize: "1.2rem"}}>لیست افراد</span>
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <Button variant="secondary" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <FileUpload uploadUrl={"/persons/import"}/>
                <DownloadTemplate
                    downloadUrl="/persons/template"
                    buttonLabel="دانلود الگوی فرد"
                    fileName="person_template.xlsx"
                />
                <NewPersonForm
                    onAddPerson={handleAddPerson}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
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
        </div>
    );
};

export default Persons;
