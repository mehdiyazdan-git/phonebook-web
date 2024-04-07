import React from 'react';
import { Controller } from 'react-hook-form';
import {NumericFormat} from 'react-number-format';
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
                        render={({ field,
                                     fieldState: { invalid, error }
                                 }) => (
                            <NumericFormat
                                thousandSeparator={","}
                                value={field.value}
                                onValueChange={(values) => {
                                    field.onChange(values.value);
                                }}
                                className={invalid ? "number-input red-placeholder" : "number-input"}
                                style={{
                                    border: invalid ? '1px solid red' : '1px solid #ccc',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    minHeight: '40px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                                }}
                                {...rest}
                            />

                        )}
                    />
                )}
            </ConnectForm>
        </div>
    );
};

export default NumberInput;
