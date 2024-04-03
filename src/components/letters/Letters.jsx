import React, {useEffect, useState} from 'react';
import "./letter.css";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import NewLetterForm from "./NewLetterForm";
import EditLetterForm from "./EditLetterForm";
import {useLocation, useParams} from "react-router-dom";
import useHttp from "../../hooks/useHttp";


const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Letters = () => {
    const { companyId } = useParams();
    const [editingLetter, setEditingLetter] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const http = useHttp();


    const location = useLocation();
    const letterType = location.pathname.split('/').pop();

     const getAllLetters = async (queryParams) => {
        return await http.get("/letters/pageable", queryParams);
    };

     const getAllByCompanyId = async (companyId, queryParams) => {
        return await http.get(`/letters/pageable?companyId=${companyId}&${queryParams.toString()}`);
    };
     const createLetter = async (data) => {
        return await http.post("/letters", data);
    };

     const updateLetter = async (id, data) => {
        return await http.put(`/letters/${id}`, data);
    };

     const removeLetter = async (id) => {
        return await http.delete(`/letters/${id}`);
    };

    // Refresh the component each time the location changes
    useEffect(() => {
        setRefreshTrigger((prev) => !prev);
    }, [location]);
    const fetchData = async (queryParams) => {
        // Add the query parameter
        queryParams.set('letterType', letterType.toUpperCase());

        if (companyId) {
            // If senderId is available, fetch letters for this sender
            return await getAllByCompanyId(Number(companyId), queryParams.toString()).then(r => r.data);
        } else {
            // Otherwise, fetch all letters
            return await getAllLetters(queryParams.toString()).then(r => r.data);
        }
    };

    const handleAddLetter = async (newLetter) => {
        newLetter.letterType = letterType.toUpperCase(); // Add the new property
        const response = await createLetter(newLetter);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
        }
    };


    const handleUpdateLetter = async (updatedLetter) => {
        const response = await updateLetter(updatedLetter.id, updatedLetter);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger); // Toggle the refresh trigger
            setEditingLetter(null);
        }
    };
    const handleDeleteLetter = async (id) => {
        await removeLetter(id);
        setRefreshTrigger(!refreshTrigger); // Refresh the table data
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '2%', sortable: true },
        {
            key: 'letterNumber',
            title: 'شماره نامه',
            width: '5%',
            sortable: true,
            searchable: true,
            render: (item) => item.letterNumber.split('/').reverse().join('/')
        },
        {
            key: 'creationDate',
            title: 'تاریخ نامه',
            width: '5%',
            sortable: true,
            searchable: true,
            type: 'date',
            render: (item) => toShamsi(item.creationDate)
        },
        { key: 'content', title: 'موضوع نامه', width: '30%', sortable: true, searchable: true },
        {
            key: 'customerName',
            title: letterType.toUpperCase() === 'OUTGOING' ? 'نام گیرنده' : 'نام فرستنده',
            width: '20%',
            sortable: true,
            searchable: true
        },
    ];


    return (
        <div className="table-container">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <NewLetterForm
                    onAddLetter={handleAddLetter}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    companyId={companyId}
                    letterType={letterType}
                />
            <Table
                columns={columns}
                fetchData={fetchData}
                onEdit={(letter) => {
                    setEditingLetter(letter);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteLetter}
                refreshTrigger={refreshTrigger} // Pass the refresh trigger
            />
            {editingLetter && (
                <EditLetterForm
                    letter={editingLetter}
                    show={showEditModal}
                    onUpdateLetter={handleUpdateLetter}
                    onHide={() => {
                        setEditingLetter(null);
                        setEditShowModal(false);
                    }}
                    letterType={letterType}
                />
            )}
        </div>

    );
};

export default Letters;
