import React from 'react';
import {Controller} from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import {ConnectForm} from "./ConnectForm";

const DateInput = ({ name,label, ...rest }) => {
    return (
        <div>
            <label className="label">{label}</label>
            <ConnectForm>
                {({ control }) => (
                    <Controller
                        control={control}
                        name={name}
                        render={({field,
                                         fieldState: { invalid,
                                         isDirty,
                                         error }
                                     ,   formState: { errors }
                                 })=>(
                            <DatePicker
                                value={field?.value ?new Date(field?.value) : ''}
                                name={field.name}
                                placeholder={invalid && error.message}
                                calendar={persian}
                                locale={persian_fa}
                                onChange={(date, { input, isTyping }) => {
                                    field.onChange(date?.isValid ? date.toDate() : "");
                                }}
                                inputClass={invalid ? "date-picker-input red-placeholder" : "table-search-input"}
                                style={{
                                    border: invalid ? '1px solid red' : '1px solid #ccc',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    minHeight: '40px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                                }}
                                containerStyle={{
                                    width: '100%',
                                }}
                                {...rest}
                            />
                        )}/>
                )}
            </ConnectForm>
        </div>
    );
};

export default DateInput;
