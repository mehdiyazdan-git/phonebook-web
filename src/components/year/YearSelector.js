import React, {useState, useEffect} from 'react';
import YearService from "../../services/yearServices";
import "./yearSelector.css"


function YearSelector() {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(localStorage.getItem('selectedYear') || '');


    useEffect(() => {
        async function loadYears() {
            await YearService.crud.getAllYears().then(response => {
                console.log("response.data", response.data)
                setYears(response.data);
            })
        }

        loadYears()

    }, []);

    const handleYearChange = (event) => {
        const selectedYear = event.target.value;
        setSelectedYear(selectedYear);
        localStorage.setItem('selectedYear', selectedYear);
        window.location.reload();
    };

    return (
        <div className="row m-1">
            <div className="col-1"><label style={{color: "white", textAlign: "center"}}
                                          htmlFor="yearSelect">سال:</label></div>
            <div className="col-11">
                <select className="drop-down"
                        id="yearSelect"
                        value={selectedYear}
                        onChange={handleYearChange}
                >
                    {years.map((year, index) => (
                        <React.Fragment key={year.id}>
                            <option
                                className="option"
                                value={year.name}
                            >
                                {year.name}
                            </option>
                            {index < years.length - 1 && <div className="separator" />}
                        </React.Fragment>
                    ))}

                </select>
            </div>
        </div>
    );
}

export default YearSelector;
