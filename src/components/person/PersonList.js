import React, {useState, useMemo,useCallback} from 'react';
import {Link} from 'react-router-dom';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import FormModal from "../../utils/FormModal";
import CustomNoRowsOverlay from "../../utils/customNoRowsOverlay";
import CustomLoadingOverlay from "../../utils/customLoadingOverlay";
import Person from "../../services/personService";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {FaEdit} from "react-icons/fa";
import AG_GRID_LOCALE_FA from "../../settings/AG_GRID_LOCALE_FA_TEXT_FILE";
import {defaultColDef, style} from "../settings/agGridSettings";
import {toShamsi} from "../../utils/util-functions";

function PersonList() {
    const [persons, setPersons] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const containerStyle = useMemo(() => ({height: 600, width: 'auto', fontFamily: 'IRANSans',fontSize:"0.75rem"}), []);

    const loadingOverlayComponent = useMemo(() => {
        return CustomLoadingOverlay;
    }, []);
    const loadingOverlayComponentParams = useMemo(() => {
        return {
            loadingMessage: 'لطفا چند لحظه صبر کنید...',
        };
    }, []);
    const noRowsOverlayComponent = useMemo(() => {
        return CustomNoRowsOverlay;
    }, []);
    const noRowsOverlayComponentParams = useMemo(() => {
        return {
            noRowsMessageFunc: () =>
                'هیچ رکوردی یافت نشد '
        };
    }, []);


    const handleContractDelete = async (id) => {
        await Person.crud.removePerson(id).then(response => {
            if (response.status === 204){
                Person.crud.getAllPersons().then(data => setPersons(data))
                setErrorMessage("شخص با موفقیت حذف شد.");
                setShowModal(true);
            }
        }).catch(result => {
            console.log(result)
            setErrorMessage(result.response.data);
            setShowModal(true);
        });
    }
    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'firstName', title: 'نام', width: '15%', sortable: true, searchable: true },
        { key: 'lastName', title: 'نام خانوادگی', width: '15%', sortable: true, searchable: true },
        { key: 'fatherName', title: 'نام پدر', width: '15%', sortable: true, searchable: true },
        { key: 'nationalId', title: 'کد ملی', width: '10%', sortable: true, searchable: true },
        { key: 'birthDate', title: 'تاریخ تولد', width: '10%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.birthDate) },
        { key: 'registrationNumber', title: 'شماره ثبت', width: '10%', sortable: true, searchable: true },
        { key: 'postalCode', title: 'کد پستی', width: '10%', sortable: true, searchable: true },
        { key: 'address', title: 'آدرس', width: '20%', sortable: true, searchable: true }
    ];


    const columnDefs = [
        {headerName: 'شناسه',
            field: 'id',
            flex:2,
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
        },
        {headerName: 'نام',
            field: 'firstName',
            flex:2,
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,

        },
        {headerName: 'نام خانوادگی',
            field: 'lastName',
            flex:4,
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
        },
        {headerName: 'شماره موبایل',
            field: 'mobile',
            flex:3,
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
        },
        {headerName: 'ایمیل',
            field: 'email',
            flex:4,
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
        },
        {
            headerName: 'عملیات',
            cellRenderer: (params) => (
                <div className="row">
                    <div className="col">
                        <Link style={{color : "green",}} to={`${params.data.id}/edit`}>
                            <FaEdit size={23}/>
                        </Link>
                    </div>
                    <div className="col">
                        <button className="btn" onClick={() => handleContractDelete(params.data.id)}>
                            <IconDeleteOutline fontSize={30}/>
                        </button>
                    </div>
                </div>
            ),

        },
    ];

    const onGridReady = useCallback(async (params) => {
        await Person.crud.getAllPersons().then((data) => {
            setPersons(data)
        });
    }, []);



    return (
        <div className="container-fluid" style={{fontFamily: 'IRANSans'}}>
            <div>
                <div>
                    <button className="btn">
                        <Link style={{textDecoration:"none",fontSize:"1.2rem"}} to="create">
                            <IconAddCircleLine fontSize={30}/>
                        </Link>
                    </button>
                </div>
            </div>
            <div className="row ag-theme-alpine" style={style}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={persons}
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
                    defaultColDef={defaultColDef}
                />
                <FormModal show={showModal} message={errorMessage} onHide={() => setShowModal(false)}/>
            </div>

        </div>
    );
}

export default PersonList;
