import {useEffect, useState} from "react";
import YearService from "../../services/yearServices";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import {FaEdit} from "react-icons/fa";
import BackButton from "../../utils/BackButton";
import FormModal from "../../utils/FormModal";
import CompanyBanner from "../../utils/CompanyBanner";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";

function FiscalYear() {
    const [years, setYears] = useState([]);
    const [newYear, setNewYear] = useState({ name: '' });
    const [updatedYear, setUpdatedYear] = useState({ id: 0, name: '' });
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        loadYears().then(response => {
            setYears(response.data);
        })
            .catch(error => {
                console.error('Error fetching years:', error);
            });
    }, []);

    const loadYears = async () => {
        return await YearService.crud.getAllYears()

    };

    const createYear = () => {
        YearService.crud.createYear(newYear)
            .then(response => {
                setNewYear({ name: '' });
                loadYears().then(response => {
                    setYears(response.data);
                })
            })
            .catch(error => {
                console.error('Error creating year:', error);
            });
    };

    const updateYear = async (id) => {
        await YearService.crud.updateYear(id, updatedYear)
            .then(response => {
                setUpdatedYear({ id: '', name: '' });
                loadYears().then(response => {
                    setYears(response.data);
                })
            })
            .catch(error => {
                console.error('Error updating year:', error);
            });
    };

    const deleteYear = async (id) => {
        await YearService.crud.removeYear(id)
            .then(response => {
                if (response.status === 204){
                    loadYears().then(response => {
                        setYears(response.data);
                        setErrorMessage("سال با موفقیت حذف شد.");
                        setShowModal(true);
                    })
                }else{
                    setErrorMessage(response);
                    setShowModal(true);
                }
            })
            .catch(result => {
                console.log(result)
                setErrorMessage(result.response.data);
                setShowModal(true);
            });
    };

    return (
        <div className="container-fluid mt-2 p-1" style={{backgroundColor : "rgba(225,225,240,0.6)",height : "80vh"}}>
            <div style={{border: "1px #9c9c9c solid", borderRadius: "4px", padding: "10px", fontFamily: "IRANSans"}}>
                <div className="row">
                    <CompanyBanner caption={"سال"}/>
                </div>
                <div className="row m-2">
                    <div className="col-11">
                        <input
                            type="text"
                            placeholder="سال جدید"
                            value={newYear.name}
                            onChange={e => setNewYear({ name: e.target.value })}
                        />
                    </div>
                    <div className="col-1">
                        <div className="row">
                            <button
                                style={{fontFamily:"IRANSans",marginRight:"0"}}
                                className="btn"
                                onClick={createYear}
                            >
                                <IconAddCircleLine fontSize={30}/>
                            </button>
                        </div>
                    </div>
                </div>
                <table style={{fontFamily:"IRANSans",border: "1px #9c9c9c solid",backgroundColor : "rgba(255,255,255,0.3)"}} className="table table-bordered table-responsive w-25">
                    <thead className="table-header">
                    <tr>
                        <th>سال</th>
                        <th>عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {years.map(year => (
                        <tr key={year.id}>
                            <td>{year.name}</td>
                            <td>
                                <button
                                    style={{fontFamily:"IRANSans",margin:"0",padding:"0",border:"none",backgroundColor:"transparent"}} className=""
                                    onClick={() => deleteYear(year.id)}>
                                    <IconDeleteOutline fontSize={30}/>
                                </button>
                                <button
                                    style={{fontFamily:"IRANSans",fontSize:"1.3rem", color:"green",margin:"0",padding:"0",border:"none",backgroundColor:"transparent"}} className="mx-2"
                                    onClick={() => setUpdatedYear({ id: year.id, year: year.name })}>
                                    <FaEdit/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {updatedYear.id && (
                    <div>
                        <input
                            type="text"
                            placeholder="سال"
                            value={updatedYear.year}
                            onChange={e => setUpdatedYear({ id: updatedYear.id, name: e.target.value })}
                        />
                        <button
                            style={{fontFamily:"IRANSans"}}
                            className="btn btn-outline-success btn-sm mt-2"
                            onClick={() => updateYear(updatedYear.id)}
                        >
                            بروز رسانی
                        </button>
                        <button
                            style={{fontFamily:"IRANSans"}}
                            className="btn btn-outline-warning btn-sm mt-2"
                            onClick={() => setUpdatedYear('')}
                        >
                            انصراف
                        </button>
                    </div>

                )}
            </div>
            <BackButton/>
            <FormModal show={showModal} message={errorMessage} onHide={() => setShowModal(false)}/>
        </div>
    );
}

export default FiscalYear;
