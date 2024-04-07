import React from 'react';
import AsyncSelect from 'react-select/async';
import useHttp from '../../hooks/useHttp';

const YearSelect = ({ onChange, value }) => {
    const http = useHttp();

    const getYearSelect = async () => {
        const response = await http.get(`/years/select`);
        return response.data.map(year => ({ value: year.id, label: year.name }));
    };

    const loadOptions = (inputValue, callback) => {
        getYearSelect().then(options => {
            callback(options);
        });
    };

    const handleChange = (selectedOption) => {
        onChange(selectedOption);
    };

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onChange={handleChange}
            value={value}
            placeholder="انتخاب..."
        />
    );
};

export default YearSelect;
