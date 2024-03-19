import React, { useState } from 'react';
import NewPersonForm from './NewPersonForm';
import EditPersonForm from './EditPersonForm';
import "./person.css";
import PersonService from "../../services/personService";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Persons = () => {
    const [editingPerson, setEditingPerson] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);


    const handleAddPerson = async (newPerson) => {
        const response = await PersonService.crud.createPerson(newPerson);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };

    const handleUpdatePerson = async (updatedPerson) => {
        const response = await PersonService.crud.updatePerson(updatedPerson.id, updatedPerson);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
            setEditingPerson(null);
        }
    };

    const handleDeletePerson = async (id) => {
        await PersonService.crud.removePerson(id);
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'firstName', title: 'نام', width: '15%', sortable: true, searchable: true },
        { key: 'lastName', title: 'نام خانوادگی', width: '15%', sortable: true, searchable: true },
        { key: 'fatherName', title: 'نام پدر', width: '15%', sortable: true, searchable: true },
        { key: 'nationalId', title: 'کد ملی', width: '10%', sortable: true, searchable: true },
        { key: 'birthDate', title: 'تاریخ تولد', width: '10%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.birthDate) },
        { key: 'registrationNumber', title: 'شماره ثبت', width: '10%', sortable: true, searchable: true },
        { key: 'postalCode', title: 'کد پستی', width: '10%', sortable: true, searchable: true },
    ];

    return (
        <div className="table-container">
            <span style={{ fontFamily: "IRANSansBold", fontSize: "1.2rem" }}>لیست افراد</span>
            <div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <NewPersonForm
                    onAddPerson={handleAddPerson}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
            <Table
                columns={columns}
                fetchData={PersonService.crud.getAllPersons}
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
