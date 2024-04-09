import React from 'react';
import { Controller } from 'react-hook-form';
import { verifyIranianLegalId } from '@persian-tools/persian-tools';
import { ConnectForm } from './ConnectForm';

export function LegalIdInput({ name, label, style, ...rest }) {
    return (
        <ConnectForm>
            {({ control, formState: { errors }, watch }) => {
                const legalIdValue = watch(name);
                let message;
                let messageColor = 'black';

                // Check for an error first. If there's no error, validate the legal ID.
                if (errors[name]) {
                    message = errors[name].message;
                    messageColor = 'red';
                } else if (legalIdValue && legalIdValue.length === 11) {
                    const isValid = verifyIranianLegalId(legalIdValue);
                    if (isValid) {
                        message = "شناسه حقوقی معتبر است.";
                        messageColor = 'green';
                    } else {
                        message = "شناسه حقوقی نامعتبر است.";
                        messageColor = 'red';
                    }
                }

                return (
                    <div style={{ marginBottom: message ? '1rem' : '0', ...style }}>
                        <label className="label">{label}</label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <div>
                                    <input
                                        {...field}
                                        {...rest}
                                        className={fieldState.error ? 'error text-danger' : ''}
                                        style={{
                                            border: fieldState.error ? '1px solid red' : '1px solid #73b5fe',
                                            borderRadius: '4px',
                                            color: fieldState.error ? 'red' : '#000',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            minHeight: '40px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            fontSize: '0.8rem',
                                            padding: '0 10px',
                                            ...style
                                        }}
                                    />
                                    {message && (
                                        <p style={{ color: messageColor, fontSize: '0.6rem', marginTop: '0.25rem', fontFamily: "IRANSans" }}>
                                            {message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                );
            }}
        </ConnectForm>
    );
}
