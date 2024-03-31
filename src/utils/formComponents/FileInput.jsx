import React from 'react';
import { Controller } from 'react-hook-form';
import { ConnectForm } from './ConnectForm';


export function FileInput({ name, label, style, ...rest }) {


    return (
        <ConnectForm>
            {({ control, formState: { errors } }) => (
                <Controller
                    name={name}
                    control={control}
                    render={({ field, fieldState }) => {
                        const hasError = fieldState.error;
                        return (
                            <div>
                                <label className="label">{label}</label>
                                <input
                                    {...field}
                                    {...rest}
                                    value={field.value}
                                    name={field.name}
                                    type="file"
                                    onChange={field.onChange}
                                    placeholder={hasError ? fieldState.error.message : ''}
                                    className={hasError ? "red-placeholder error text-danger" : ""}
                                    style={{
                                        border: hasError ? '1px solid red' : '1px solid #73b5fe',
                                        borderRadius: "4px",
                                        color: hasError ? 'red' : '#000',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        minHeight: '40px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: "0.8rem",
                                        padding: '0 10px',
                                        ...style
                                    }}
                                />
                                {hasError && (
                                    <span className="text-danger">{fieldState.error.message}</span>
                                )}
                            </div>
                        );
                    }}
                />
            )}
        </ConnectForm>
    );
}
