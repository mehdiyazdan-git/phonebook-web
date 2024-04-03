import React from 'react';
import Select from "react-select";
import { ConnectForm } from './ConnectForm';
import {Controller} from "react-hook-form";
import {getCustomSelectStyles} from "./customStyles";

const SelectInput = ({ name, options,label }) => {
    return (
        <ConnectForm>
            {({ control}) => (
                <Controller
                    name={name}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            <label className="label">{label}</label>
                            <Select
                                {...field}
                                value={field?.value}
                                name={field.name}
                                placeholder={error ? error.message : 'انتخاب...'}
                                className={error ? "error text-danger" : ""}
                                options={options}
                                styles={getCustomSelectStyles(error)}
                            />
                        </div>
                    )}
                />
            )}
        </ConnectForm>
    );
};

export default SelectInput;
