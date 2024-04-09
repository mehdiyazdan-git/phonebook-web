import React from 'react';
import { Controller } from 'react-hook-form';
import { phoneNumberDetail } from '@persian-tools/persian-tools';
import { ConnectForm } from './ConnectForm';

export function PhoneNumberInput({ name, label, style, ...rest }) {
    return (
        <ConnectForm>
            {({ control, formState: { errors }, watch }) => {
                const phoneNumberValue = watch(name);
                let phoneInfo;
                let message;
                let messageColor = 'black';

                if (errors[name]) {
                    message = errors[name].message;
                    messageColor = 'red';
                } else if (phoneNumberValue) {
                    try {
                        phoneInfo = phoneNumberDetail(phoneNumberValue);
                        if (phoneInfo) {
                            // Map the base type to Persian words
                            const typeInPersian = phoneInfo.type.map(type => {
                                return type === "permanent" ? "دائمی" : "اعتباری";
                            }).join(", ");

                            message = `${phoneInfo.base} - ${phoneInfo.operator} - ${typeInPersian}`;
                            messageColor = 'green';
                        }
                    } catch (error) {
                        // Handle the error here if needed.
                        console.error(error);
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
