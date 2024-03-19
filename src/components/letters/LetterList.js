import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Link} from "react-router-dom";
import IconEdit from "../assets/icons/IconEdit";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import CustomLoadingOverlay from "../../utils/customLoadingOverlay";
import CustomNoRowsOverlay from "../../utils/customNoRowsOverlay";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {AgGridReact} from "ag-grid-react";
import AG_GRID_LOCALE_FA from "../../settings/AG_GRID_LOCALE_FA_TEXT_FILE";
import Letter from "../../services/letterService";
import moment from "jalali-moment";
import ToggleButton from "./ToggleButton";
import SenderDropdown from "../dropdowns/CompanyDropdown";
import {defaultColDef} from "../settings/agGridSettings";
import SubmittingModal from "../../utils/SubmittingModal";
import ConfirmationModal from "../table/ConfirmationModal";
import FormModal from "../../utils/FormModal";


function toShamsi(date) {
   return  moment(date, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
}
const LetterList = () => {
    const [rowData, setRowData] = useState(null);
    const [senderId, setSenderId] = useState(8);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedLetterId, setSelectedLetterId] = useState(null);


    const handleLetterDelete = (id) => {
        setSelectedLetterId(id);
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsSubmitting(true)
        await Letter.crud.removeLetter(selectedLetterId).then(response => {
            if (response.status === 204) {
                setIsSubmitting(false)
                setErrorMessage("نامه با موفقیت حذف شد.");
                setShowModal(true);
                Letter.crud.getAllLetters().then(response => setRowData(response.data))
            }
        }).catch((result) => {
            console.log(result);
            setIsSubmitting(false)
            setErrorMessage(result.response.data.message);
            setShowModal(true);
        });
    }

    useEffect(() => {
        fetchLetters().then(response => setRowData(response.data));
    }, []);
    useEffect(() => {
    Letter.crud.getAllBySenderId(senderId).then(response => setRowData(response.data));
    }, [senderId]);

    const fetchLetters = async () => {
        return await Letter.crud.getAllLetters();
    };
    const refreshGrid = async () => {
        await Letter.crud.getAllLetters().then(response => setRowData(response.data))
    };

    const columnDefs = [
        {
            headerName: 'شماره نامه',
            field: 'letterNumber',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 2
        },
        {
            headerName: 'موضوع',
            field: 'letterTopic',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 5
        },
        {
            headerName: 'فرستنده',
            field: 'senderName',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 3
        },
        {
            headerName: 'گیرنده',
            field: 'recipientName',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 3
        },
        {
            headerName: 'تاریخ نامه',
            field: 'letterDate',
            valueFormatter: (params) => moment(params.value, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD'),
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 2
        },
        {
            headerName: 'عملیات',
            cellRenderer: (params) => {
                const letterId = params.data.letterId;
                return (
                    <div>
                        <Link to={`/letters/${letterId}/edit`}>
                            <IconEdit fontSize={'1rem'} color="green" />
                        </Link>
                        <span style={{ margin: '0 5px' }}>|</span>
                        <button
                            style={{ border: 'none', background: 'transparent', margin: '0', padding: '0' }}
                            type="button"
                            onClick={() => handleLetterDelete(letterId)}
                            disabled={(params.data.letterState === 'DELIVERED')}
                        >
                            <IconDeleteOutline size={'1.5rem'} color={(params.data.letterState === 'DELIVERED') ? "lightGray" : "red"}  />
                        </button>
                        <span style={{ margin: '0 5px' }}>|</span>
                        <ToggleButton letterId={letterId} initialLetterState={params.data.letterState} onUpdate={refreshGrid} />
                    </div>
                );
            },
            flex: 2,
        },
    ];




    const loadingOverlayComponent = useMemo(() => CustomLoadingOverlay, []);
    const loadingOverlayComponentParams = useMemo(
        () => ({ loadingMessage: 'لطفا چند لحظه صبر کنید...' }),
        []
    );
    const noRowsOverlayComponent = useMemo(() => CustomNoRowsOverlay, []);
    const noRowsOverlayComponentParams = useMemo(
        () => ({
            noRowsMessageFunc: () => 'هیچ رکوردی یافت نشد ',
        }),
        []
    );

    const gridOptions = {
        defaultColDef: {
            resizable: true,
        },
    };

    const onGridReady = useCallback(async (params) => {
        await Letter.crud.getAllLetters().then((response) => {
            setRowData(response.data)
        });
    }, []);

    return (
        <div className="container-fluid p-3"
             style={{

                 minHeight:"80vh",

             }}>
            <h5 style={{textAlign:"center",fontFamily:"IRANSansBold"}}>لیست نامه ها</h5>
           <div className="flex-row">
               <div className="col-2">
                   <label className="label">انتخاب گیرنده :</label>
               </div>
               <div className="col-6">
                   <SenderDropdown onSelect={setSenderId}/>
               </div>
           </div>
            <div>
                <div>
                    <button className="btn">
                        <Link style={{textDecoration:"none",fontSize:"1.2rem"}} to="create">
                            <IconAddCircleLine fontSize={30}/>
                        </Link>
                    </button>
                </div>
            </div>
            <div className="ag-theme-alpine" style={{width:"100%",height:"70vh",fontFamily:"IRANSans"}}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    enableRtl={true}
                    pagination={true}
                    paginationAutoPageSize={true}
                    suppressHorizontalScroll={true}
                    localeText={AG_GRID_LOCALE_FA}
                    loadingOverlayComponent={loadingOverlayComponent}
                    loadingOverlayComponentParams={loadingOverlayComponentParams}
                    noRowsOverlayComponent={noRowsOverlayComponent}
                    noRowsOverlayComponentParams={noRowsOverlayComponentParams}
                    onGridReady={onGridReady}
                    gridOptions={gridOptions}
                    defaultColDef={defaultColDef}
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

export default LetterList;
