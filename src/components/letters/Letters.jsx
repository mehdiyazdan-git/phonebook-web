import React, {useEffect, useState} from 'react';
import "./letter.css";
import Button from "../../utils/Button";
import moment from "jalali-moment";
import Table from "../table/Table";
import NewLetterForm from "./NewLetterForm";
import EditLetterForm from "./EditLetterForm";
import {useLocation, useParams} from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import { saveAs } from 'file-saver';
import getCurrentYear from "../../utils/functions/getCurrentYear";



const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};


const Letters = () => {
    const http = useHttp();
    const [years, setYears] = useState([]);
    const { companyId } = useParams();
    const [editingLetter, setEditingLetter] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const location = useLocation();
    const letterType = location.pathname.split('/').pop();
    const [selectedYear, setSelectedYear] = useState();


    const SelectYear = () => {
        return (
            <div className="select-year">
                <select
                    className="form-control"
                    value={selectedYear}
                    style={{fontFamily:"IRANSans",fontSize:"0.8rem"}}
                    onChange={(e) => {
                        setSelectedYear(e.target.value);
                        sessionStorage.setItem('selectedYear', e.target.value);
                        setRefreshTrigger(!refreshTrigger);
                    }}
                >
                    {years.map(year => (
                        <option key={year.value} value={year.value} style={{fontFamily:"IRANSans",fontSize:"0.8rem"}}>
                            {year.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const fetchYears = async () => {
        try {
            const data = await http.get(`/years/select?searchQuery=`).then(r => r.data);
            let yearOptions = data.map(year => ({
                label: year.name,
                value: year.id,
                startingLetterNumber: year.startingLetterNumber
            }));

            // Sort year options in descending order by label
            yearOptions.sort((a, b) => b.label - a.label);
            setYears(yearOptions);

            if (!selectedYear) {
                const storedYear = sessionStorage.getItem('selectedYear');
                const currentYear = getCurrentYear();
                const currentYearOption = yearOptions.find(year => year.label === currentYear);

                if (storedYear) {
                    setSelectedYear(storedYear);
                } else if (currentYearOption) {
                    setSelectedYear(currentYearOption.value);
                    sessionStorage.setItem('selectedYear', currentYearOption.value);
                } else {
                    // Set the first item from the sorted array if current year is not found
                    setSelectedYear(yearOptions[0].value);
                    sessionStorage.setItem('selectedYear', yearOptions[0].value);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    useEffect(() => {
        setRefreshTrigger(prev => !prev)
    }, [location,selectedYear]);

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
        const sessionStorageYear = sessionStorage.getItem('selectedYear');
        queryParams.set('yearId', Number(sessionStorageYear));
        queryParams.set('letterType', letterType.toUpperCase());
        if (companyId) {
            return await http.get(`/letters/pageable?companyId=${companyId}&${queryParams.toString()}`).then(r => r.data);
        } else {
            return await http.get(`/letters/pageable?${queryParams.toString()}`).then(r => r.data);
        }
    };

    async function downloadExcelFile() {
        await http.get('/letters/export', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "letters.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    const formatDate = (date) => moment(new Date(date)).format('YYYY-MM-DD');
    const handleAddLetter = async (newLetter) => {
        if (newLetter.creationDate){
            newLetter.creationDate = formatDate(newLetter.creationDate);
        }
        newLetter.letterType = "DRAFT";
        const response = await createLetter(newLetter);
        if (response.status === 201) {
            setRefreshTrigger(!refreshTrigger);
        }
    };

    const handleUpdateLetter = async (updatedLetter) => {
        if (updatedLetter.creationDate){
            updatedLetter.creationDate = formatDate(updatedLetter.creationDate);
        }
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
            // render: (item) => item.letterNumber.split('/').reverse().join('/')
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
            title: letterType === "outgoing" ? 'گیرنده' : 'فرستنده',
            width: '20%',
            sortable: true,
            searchable: true
        },
    ];

    return (
        <div className="table-container">
            <ButtonContainer
                >
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <div className={"d-flex justify-content-end align-content-center"}>
                    <label className={"label align-content-center m-1 mx-3"}>انتخاب سال</label>
                    <SelectYear/>
                </div>
                <Button variant="success" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
            </ButtonContainer>
            <NewLetterForm
                onAddLetter={handleAddLetter}
                show={showModal}
                onHide={() => setShowModal(false)}
                companyId={Number(companyId)}
                letterType={letterType}
                year={years.find(year => year.value === Number(sessionStorage.getItem('selectedYear')))}
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
                    letterType={letterType}
                />
            )}
        </div>
    );
};

export default Letters;
