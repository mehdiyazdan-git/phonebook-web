import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Letter from "../../services/letterService";
import moment from "jalali-moment";
import {Link, useParams} from "react-router-dom";
import IconEdit from "../assets/icons/IconEdit";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import ToggleButton from "../letters/ToggleButton";
import CustomLoadingOverlay from "../../utils/customLoadingOverlay";
import CustomNoRowsOverlay from "../../utils/customNoRowsOverlay";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {AgGridReact} from "ag-grid-react";
import AG_GRID_LOCALE_FA from "../../settings/AG_GRID_LOCALE_FA_TEXT_FILE";

const SenderLetters = () => {
    const {senderId} = useParams();
    const [rowData, setRowData] = useState(null);


    useEffect(() => {
        Letter.crud.getAllBySenderId(senderId).then(response => setRowData(response.data));
    }, [senderId]);


    const refreshGrid = async () => {
        await Letter.crud.getAllBySenderId(senderId).then(response => setRowData(response.data))
    };

    const columnDefs = [
        {
            headerName: 'شماره نامه',
            field: 'letterNumber',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 3
        },
        {
            headerName: 'موضوع',
            field: 'letterTopic',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 2
        },
        {
            headerName: 'فرستنده',
            field: 'senderName',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 2
        },
        {
            headerName: 'گیرنده',
            field: 'recipientName',
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            flex: 2
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
                            onClick={() => deleteLetter(letterId)}
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

    const deleteLetter = async (recipientId) => {
        try {
            await Letter.crud.removeLetter(recipientId).then(response => {
                if (response.status === 204) {
                    Letter.crud.getAllLetters().then(response => setRowData(response.data))
                }
            })

        } catch (error) {
            console.error('Error deleting sender:', error);
        }
    };


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
        await Letter.crud.getAllBySenderId(senderId).then((response) => {
            setRowData(response.data)
        });
    }, []);

    return (
        <div className="container-fluid" style={{fontFamily:"IRANSans"}}>
            <div>
                <div>
                    <button className="btn">
                        <Link style={{textDecoration:"none",fontSize:"1.2rem"}} to="create">
                            <IconAddCircleLine fontSize={30}/>
                        </Link>
                    </button>
                </div>
            </div>
            <div className="ag-theme-alpine" style={{height: '70vh', width: 'auto',fontFamily:"IRANSans"}}>
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
                />
            </div>
        </div>
    );
};


export default SenderLetters;
