import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import DateInput from "./DateInput";


export default function InputDatePicker({ name, control, label, errorMessage, disabled }) {
    const datePickerRef = useRef();

    return (
        <Controller
            control={control}
            name={name}
            rules={{ required: true }}
            render={({ field: { onChange, name, value },
                         fieldState: { invalid, isDirty,error }, formState: { errors } }) => (
                <div>
                    <DateInput
                        ref={datePickerRef} // Attach the ref to the CustomDatePicker
                        label={label}
                        name={name}
                        value={value}
                        onChange={onChange}
                        invalid={invalid}
                        errors={errors}
                        errorMessage={errorMessage}
                        disabled={disabled}
                    />
                </div>
            )}
        />
    );
}

