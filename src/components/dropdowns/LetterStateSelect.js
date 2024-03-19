import React from 'react';
import Select from 'react-select';

const LetterStateSelect = ({ value, onChange }) => {
    const options = [
        { value: 'DRAFT', label: 'پیش نویس' },
        { value: 'SENT', label: 'ارسال شده' },
    ];

    return (
        <Select
            options={options}
            value={options.find((option) => option.value === value)}
            onChange={(selectedOption) => onChange(selectedOption.value)}
        />
    );
};

export default LetterStateSelect;
