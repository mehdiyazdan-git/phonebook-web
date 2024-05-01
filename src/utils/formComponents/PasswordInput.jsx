import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export function PasswordInput({ control, name, label, backgroundColor, labelStyle, ...rest }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => {
                const hasError = fieldState.error;
                return (
                    <div style={{ marginBottom: '1rem' }}>
                        {label && <label className="label" style={labelStyle}>{label}</label>}
                        <div style={{ position: 'relative' }}>
                            <input
                                {...field}
                                {...rest}
                                type={showPassword ? 'text' : 'password'}
                                className={`input ${hasError ? 'input-error' : ''}`}
                                style={{
                                    border: hasError ? '1px solid red' : '1px solid #73b5fe',
                                    borderRadius: '4px',
                                    color: hasError ? 'red' : '#000',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    minHeight: '40px',
                                    backgroundColor: backgroundColor ? backgroundColor : 'rgba(255, 255, 255, 0.1)',
                                    fontSize: '0.8rem',
                                    paddingRight: '40px', // room for icon
                                    paddingLeft: '10px',
                                }}
                            />
                            <button
                                type="button"
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
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    zIndex: 2,
                                }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {hasError && <p style={{ color: 'red', fontSize: '0.6rem' }}>{fieldState.error.message}</p>}
                    </div>
                );
            }}
        />
    );
}
