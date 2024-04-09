import React from 'react';
import AsyncSelect from 'react-select/async';
import useHttp from '../../hooks/useHttp';

const YearSelect = ({ onChange, value }) => {
    const http = useHttp();

    const getYearSelect = async () => {
        const response = await http.get(`/years/select`);
        console.log(response.data)
        return response.data.map(year => ({ value: year.id, label: year.name, startingLetterNumber: year.startingLetterNumber }));
    };

    const loadOptions = (inputValue, callback) => {
        getYearSelect().then(options => {
            callback(options);
        });
    };

    const handleChange = (selectedOption) => {
        onChange(selectedOption);
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            borderColor: '#ced4da',
            minHeight: '35px',
            height: '35px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#adb5bd'
            }
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '35px',
            padding: '0 6px'
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '35px',
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white' : 'black',
            backgroundColor: state.isSelected ? '#007bff' : 'white',
            '&:hover': {
                backgroundColor: '#e9ecef'
            }
        }),
    };

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onChange={handleChange}
            value={value}
            placeholder="انتخاب..."
            styles={customStyles}
        />
    );
};

export default YearSelect;
