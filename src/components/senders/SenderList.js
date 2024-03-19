import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Sender from "../../services/senderService";
import {Link} from 'react-router-dom';
import IconEdit from "../assets/icons/IconEdit";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import {defaultColDef, style} from "../settings/agGridSettings";
import SubmittingModal from "../../utils/SubmittingModal";
import FormModal from "../../utils/FormModal";
import ConfirmationModal from "../table/ConfirmationModal";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import AG_GRID_LOCALE_FA from "../../settings/AG_GRID_LOCALE_FA_TEXT_FILE";

const SenderList = () => {
    const [senders, setSenders] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedSenderId, setSelectedSenderId] = useState(null);


    const handleSenderDelete = (id) => {
        setSelectedSenderId(id);
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsSubmitting(true)
       await Sender.crud.removeSender(selectedSenderId).then(response => {
            if (response.status === 204) {
                setIsSubmitting(false)
                setErrorMessage("فرستنده با موفقیت حذف شد.");
                setShowModal(true);
                Sender.crud.getAllSenders().then(response => setSenders(response.data))
            }
        }).catch((result) => {
            console.log(result);
            setIsSubmitting(false)
           setErrorMessage(result.response.data.message);
            setShowModal(true);
        });
    }

    useEffect(() => {
        async function loadData() {
            return await Sender.crud.getAllSenders()
        }

        loadData().then(response => setSenders(response.data))
    }, []);


    // Ag-Grid Configuration
    const columnDefs = [
        {
            headerName: 'نام',
            field: 'name',
            sortable: true,
            filter: true,
            floatingFilter: true,
            flex: 2
        },
        {
            headerName: 'آدرس',
            field: 'address',
            sortable: true,
            filter: true,
            floatingFilter: true,
            flex: 5
        },
        {
            headerName: 'شماره تلفن',
            field: 'phoneNumber',
            sortable: true,
            filter: true,
            floatingFilter: true,
            flex: 2
        },
        {
            headerName: 'عملیات',
            cellRenderer: (params) => {
                const senderId = params.data.id;
                return (
                    <div>
                        <Link to={`/senders/${senderId}/edit`}>
                            <IconEdit fontSize={"1rem"} color="green"/>
                        </Link>
                        <span style={{margin: '0 5px'}}>|</span>
                        <button
                            style={{border: "none", background: "transparent", margin: "0", padding: "0"}} type="button"
                            onClick={() => handleSenderDelete(senderId)}>
                            <IconDeleteOutline size={"1.5rem"}/>
                        </button>
                    </div>
                );
            },
            flex: 2
        },
    ];

    const gridOptions = {
        defaultColDef: {
            resizable: true,
        },
        rowClass : "row-class"
    };

    return (
        <div className="container-fluid">
            <div className="mb-3">
                <div>
                    <button className="btn">
                        <Link style={{textDecoration:"none",fontSize:"1.2rem"}} to="/senders/create">
                            <IconAddCircleLine fontSize={30}/>
                        </Link>
                    </button>
                </div>
            </div>
            <div className="ag-theme-alpine " style={style}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={senders}
                    gridOptions={gridOptions}
                    enableRtl={true}
                    pagination={true}
                    paginationAutoPageSize={true}
                    defaultColDef={defaultColDef}
                    localeText={AG_GRID_LOCALE_FA}
                />
            </div>
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
            }}>
                <SubmittingModal loading={isSubmitting}/>
            </div>
            <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleConfirmDelete}
            />
            <FormModal show={showModal} message={errorMessage} onHide={() => setShowModal(false)}/>
        </div>
    );
};

export default SenderList;
