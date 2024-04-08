import React, {useEffect, useState} from 'react';
import "./letter.css";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import NewLetterForm from "./NewLetterForm";
import EditLetterForm from "./EditLetterForm";
import {useLocation, useParams} from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import YearSelect from "../year/YearSelector";


const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Letters = () => {
    const http = useHttp();
    const { companyId } = useParams();
    const [year, setYear] = useState(null);
    const [editingLetter, setEditingLetter] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);

    const location = useLocation();
    const letterType = location.pathname.split('/').pop();

    // Refresh the component each time the location changes or year changes
    useEffect(() => {
        setRefreshTrigger(prev => !prev);
    }, [location, year]); // Add year as a dependency



    const getAllByCompanyId = async (companyId, queryParams) => {
        return await http.get(`/letters/pageable?companyId=${Number(companyId)}&yearId=${year ? Number(year.value) : 3}&${queryParams.toString()}`);
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

    const fetchData = async (queryParams) => {
        // Ensure the year value is incorporated in your fetch query
        if (year) {
            queryParams.set('yearId', year); // Example of adding year to query parameters
        }
        queryParams.set('letterType', letterType.toUpperCase());

        if (companyId) {
            // If companyId is available, fetch letters for this sender
            return await getAllByCompanyId(Number(companyId), queryParams).then(r => r.data);
        } else {
            // Otherwise, fetch all letters
            return await getAllByCompanyId(queryParams).then(r => r.data);
        }
    };


    const handleAddLetter = async (newLetter) => {
        newLetter.letterType = "DRAFT";
        const response = await createLetter(newLetter);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger);
        }
    };

    const handleUpdateLetter = async (updatedLetter) => {
        const response = await updateLetter(updatedLetter.id, updatedLetter);
        if (response.status === 200) {
            setRefreshTrigger(!refreshTrigger);
            setEditingLetter(null);
        }
    };

    const handleDeleteLetter = async (id) => {
        await removeLetter(id);
        setRefreshTrigger(!refreshTrigger);
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
            title: 'نام طرف مقابل',
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
            <YearSelect value={year} onChange={setYear} />
            <NewLetterForm
                onAddLetter={handleAddLetter}
                show={showModal}
                onHide={() => setShowModal(false)}
                companyId={companyId}
            />
            <Table
                columns={columns}
                fetchData={fetchData}
                onEdit={(letter) => {
                    setEditingLetter(letter);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteLetter}
                refreshTrigger={refreshTrigger}
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
                />
            )}
        </div>
    );
};

export default Letters;
