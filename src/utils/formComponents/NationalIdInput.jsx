import React from 'react';
import { Controller } from 'react-hook-form';
import { getPlaceByIranNationalId } from '@persian-tools/persian-tools';
import { ConnectForm } from './ConnectForm';

export function NationalIdInput({ name, label, style, ...rest }) {
    return (
        <ConnectForm>
            {({ control, formState: { errors }, watch }) => {
                // Accessing watch from context
                const nationalIdValue = watch(name);
                let placeInfo = '';
                let message;
                let messageColor = 'black';

                if (nationalIdValue && !errors[name]) {
                    try {
                        placeInfo = getPlaceByIranNationalId(nationalIdValue)?.city || '';
                        message = placeInfo;
                        messageColor = 'green';
                    } catch (error) {
                        // Handle error if necessary
                        console.error(error);
                    }
                }

                if (errors[name]) {
                    message = errors[name].message;
                    messageColor = 'red';
                }

                return (
                    <div style={{ marginBottom: message ? '1rem' : '0', ...style }}>
                        <label className="label">{label}</label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => {
                                return (
                                    <div>
                                        <input
                                            {...field}
                                            {...rest}
                                            className={fieldState.error ? 'red-placeholder error text-danger' : ''}
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
                                            <p style={{ color: messageColor, fontSize: '0.6rem', marginTop: '0.25rem',fontFamily: "IRANSans" }}>
                                                {message}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </div>
                );
            }}
        </ConnectForm>
    );
}
