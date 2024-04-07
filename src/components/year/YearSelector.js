import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import useHttp from '../../hooks/useHttp';

const YearSelect = ({ onChange, value, currentYear }) => {
    const http = useHttp();
    const [selectedYear, setSelectedYear] = useState(null);

    const getYearSelect = async () => {
        const response = await http.get(`/years/select`);
        const options = response.data.map(year => ({ value: year.id, label: year.name }));
        // Find the option that matches currentYear and set it as the selected value
        const matchingOption = options.find(option => option.label === currentYear);
        if (matchingOption) {
            setSelectedYear(matchingOption);
            onChange(matchingOption); // Trigger onChange with the matching option
        }
        return options;
    };

    const loadOptions = (inputValue, callback) => {
        getYearSelect().then(options => {
            callback(options);
        });
    };

    const handleChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        onChange(selectedOption);
    };

    // Fetch options and set the matching option based on currentYear on component mount
    useEffect(() => {
        getYearSelect();
    }, [currentYear]);

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            defaultValue={selectedYear}
            onChange={handleChange}
            value={value}
        />
    );
};

export default YearSelect;
