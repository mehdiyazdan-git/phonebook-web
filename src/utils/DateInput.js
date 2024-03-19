import React, { forwardRef } from 'react';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";




const DateInput = forwardRef(({ value, onChange, label, name, invalid, errors ,errorMessage,disabled}, ref) => {
    return (
        <div className="row">
            <label className="label" htmlFor={name}>{label}</label>
            <DatePicker
                id={name}
                calendar={persian}
                locale={persian_fa}
                value={value || ''}
                placeholder={invalid && errorMessage}
                onChange={(date) => {
                    onChange(date?.isValid ? date.toDate() : '');
                }}
                format="YYYY/MM/DD"
                inputClass={invalid ? "contract-new-datepicker red-placeholder" : "contract-new-datepicker"}
                style={{
                    border: invalid ? '1px solid red' : '1px solid #ccc',
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    fontSize:"0.8rem"
                }}
                containerStyle={{
                    width: '100%',
                }}
                ref={ref} // Attach the ref to the DatePicker
                disabled={disabled}
            />
        </div>
    );
});

export default DateInput;

