import React, { useState } from 'react';
import DatePicker from 'react-multi-date-picker';


const SearchableDatePicker = ({ search, setSearch }) => {

    return (
        <div>
            <DatePicker
                value={search?.registerDate}
                format="YYYY-MM-DD"
                type="search"
                inputClass="table-search-input"
                placeholder="جستجو..."
                onFocusedDateChange={(dateFocused, dateClicked) => {
                    setSearch({ ...search, registerDate: dateClicked?.isValid ? dateClicked.format('YYYY-MM-DD') : '' });
                }}
                onClose={() => setSearch({ ...search, registerDate:  '' })}
            >
            </DatePicker>
        </div>
    );
};

export default SearchableDatePicker;
