import React from 'react';
import Select from "react-select";
import { ConnectForm } from './ConnectForm';
import {Controller} from "react-hook-form";

const SelectInput = ({ name, options }) => {
    return (
        <ConnectForm>
            {({ control, formState: { errors } }) => (
                <Controller
                    name={name}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Select
                            {...field}
                            placeholder={error ? error.message : ''}
                            className={error ? "error text-danger" : ""}
                            options={options}
                        />
                    )}
                />
            )}
        </ConnectForm>
    );
};

export default SelectInput;
