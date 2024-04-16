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
import ButtonContainer from "../../utils/formComponents/ButtonContainer";
import DownloadTemplate from "../../utils/formComponents/DownloadTemplate";
import { saveAs } from 'file-saver';
import FileUpload from "../../utils/formComponents/FileUpload";


const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Letters = () => {
    const http = useHttp();
    const { companyId } = useParams();
    const [editingLetter, setEditingLetter] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);

    const location = useLocation();
    const letterType = location.pathname.split('/').pop();

    const initialYear = JSON.parse(sessionStorage.getItem('selectedYear'));
    const [year, setYear] = useState(initialYear);

    // Store the year in session storage when it changes
    useEffect(() => {
        if (year !== null) {
            sessionStorage.setItem('selectedYear', JSON.stringify(year));
        }
    }, [year]);

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
        if (year) {
            queryParams.set('yearId', year.value); // Ensure year value is used in fetch query
        }
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
                lastChild={
                    <FileUpload
                        uploadUrl={"/letters/import"}
                        setRefreshTrigger={setRefreshTrigger}
                        refreshTrigger={refreshTrigger}
                    />
                }>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    جدید
                </Button>
                <div className={"d-flex justify-content-end align-content-center"}>
                    <label className={"label align-content-center m-1 mx-3"}>انتخاب سال</label>
                    <YearSelect value={year} onChange={setYear}/>
                </div>
                <Button variant="success" onClick={downloadExcelFile}>
                    دانلود به Excel
                </Button>
                <DownloadTemplate
                    downloadUrl="/letters/template"
                    buttonLabel="فرمت بارگذاری"
                    fileName="template_letters.xlsx"
                />
            </ButtonContainer>
            <NewLetterForm
                onAddLetter={handleAddLetter}
                show={showModal}
                onHide={() => setShowModal(false)}
                companyId={Number(companyId)}
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
