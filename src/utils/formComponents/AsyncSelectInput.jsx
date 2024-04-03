import React from 'react';
import {Controller} from "react-hook-form";
import {ConnectForm} from "./ConnectForm";
import AsyncSelectDropdown from "./AsyncSelectDropdown";

const AsyncSelectInput = ({fetchCallBack, defaultOptions, disabled, name, searchCallback, id}) => {
    return (
        <ConnectForm>
            {({ control}) => (
                <Controller
                    rules={{ required: true }}
                    name={name}
                    control={control}
                    defaultValue={id}
                    render={({ field, fieldState }) => (
                        <AsyncSelectDropdown
                            id={field.value || id}
                            onSelect={field.onChange}
                            ref={field.ref}
                            name={field.name}
                            error={fieldState.error ? "مقدار فیلد الزامیست." : ""}
                            fetchCallBack={fetchCallBack}
                            searchCallback={searchCallback}
                            defaultOptions={defaultOptions}
                            disabled={disabled}
                        />
                    )}
                />
            )}
        </ConnectForm>
    );
};
export default AsyncSelectInput;
