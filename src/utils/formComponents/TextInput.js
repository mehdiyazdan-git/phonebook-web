import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { ConnectForm } from './ConnectForm';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ensure you have react-icons installed

export function TextInput({ name, label, type, ...rest }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <ConnectForm>
            {({ control }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => {
                        const hasError = fieldState.error;
                        return (
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        {...field}
                                        {...rest}
                                        type={type === 'password' && !showPassword ? 'password' : 'text'}
                                        className={`input ${hasError ? 'red-placeholder' : ''}`}
                                        style={{
                                            border: hasError ? '1px solid red' : '1px solid #73b5fe',
                                            borderRadius: '4px',
                                            color: hasError ? 'red' : '#000',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            minHeight: '40px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            fontSize: '0.8rem',
                                            paddingRight: type === 'password' ? '40px' : '10px',
                                            paddingLeft: '10px',
                                        }}
                                    />
                                    {type === 'password' && (
                                        <button
                                            type={"button"}
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '1px',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '40px',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                zIndex: 2,
                                            }}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    )}
                                </div>
                                {hasError && <p style={{ color: 'red', fontSize: '0.8rem' }}>{fieldState.error.message}</p>}
                            </div>
                        );
                    }}
                />
            )}
        </ConnectForm>
    );
}
