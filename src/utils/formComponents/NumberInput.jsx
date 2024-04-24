import React from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ConnectForm } from "./ConnectForm";

const NumberInput = ({ name, label, ...rest }) => {
    return (
        <div>
            <label className="label">{label}</label>
            <ConnectForm>
                {({ control }) => (
                    <Controller
                        control={control}
                        name={name}
                        render={({ field, fieldState: { invalid, error } }) => (
                            <>
                                <NumericFormat
                                    thousandSeparator=","
                                    value={field.value}
                                    onValueChange={(values) => {
                                        field.onChange(values.value);
                                    }}
                                    className="number-input"
                                    style={{
                                        border: invalid ? '1px solid red' : '1px solid #ccc',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        minHeight: '40px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)'
                                    }}
                                    {...rest}
                                />
                                {invalid && error && (
                                    <div style={{
                                        color: 'red',
                                        fontSize: '0.75em', // Smaller font size
                                        marginTop: '2px' // Space between input and error message
                                    }}>
                                        {error.message}
                                    </div>
                                )}
                            </>
                        )}
                    />
                )}
            </ConnectForm>
        </div>
    );
};

export default NumberInput;
