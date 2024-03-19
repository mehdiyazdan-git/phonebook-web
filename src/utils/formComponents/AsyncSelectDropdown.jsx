import { useEffect, useState } from "react";
import Select from 'react-select/async';
import { getCustomSelectStyles } from "./customStyles";
import { useFormContext } from "react-hook-form";

const AsyncSelectDropdown = ({
                                 id,
                                 ref,
                                 onSelect,
                                 name,
                                 error,
                                 fetchCallBack, // This function is expected to return a promise resolving to an array of options
                                 defaultOptions = [], // Set a default value for defaultOptions
                                 searchCallback,
                                 disabled
                             }) => {
    const { getValues } = useFormContext()
    const [options, setOptions] = useState(defaultOptions);
    const [selectedOption, setSelectedOption] = useState({ value: id, label: '' });
    const customStyles = getCustomSelectStyles(error);

    const handleChange = (option) => {
        setSelectedOption(option);
        onSelect(option ? option.value : null);
    };
    const loadOptions = async (inputValue, callback) => {
        if (inputValue) {
            const data = await searchCallback(inputValue);
            const options = data.map((record) => ({
                label: record.name,
                value: record.id,
            }));
            callback(options);
        } else {
            callback(defaultOptions); // Use the default options when no input value is provided
        }
    };

    useEffect(() => {
        const fetchDefaultOptions = async () => {
            const resultSet = await fetchCallBack();
            return resultSet.map((record) => ({
                label: record.name,
                value: record.id,
            }));
        };
        fetchDefaultOptions().then(options => setOptions(options))
    }, [fetchCallBack]);

    useEffect(() => {
        // When the `id` or options change, update the selected option
        if (id && options.length) {
            const option = options.find((o) => o.value === id);
            setSelectedOption(option || null);
        } else {
            setSelectedOption(null);
        }
    }, [id, options]);

    useEffect(() => {
        // Update the selected option based on the value returned by getValues(name)
        const value = getValues(name);
        if (value && options.length) {
            const option = options.find((o) => o.value === value);
            setSelectedOption(option || null);
        }
    }, [getValues(name), options]);

    return (
        <div style={{ fontFamily: "IRANSans" }}>
            <Select
                id={name}
                name={name}
                ref={ref}
                onChange={handleChange}
                loadOptions={loadOptions}
                value={selectedOption}
                placeholder={error ? error : "انتخاب..."}
                defaultOptions={options} // Use the state for the default options
                cacheOptions
                className={error ? "error text-danger" : ""}
                styles={customStyles}
                isDisabled={disabled}
            />
        </div>
    );
};

export default AsyncSelectDropdown;
