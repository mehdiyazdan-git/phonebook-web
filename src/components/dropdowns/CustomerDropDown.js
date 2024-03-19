import { useEffect, useState } from "react";
import Select from 'react-select/async';
import Customer from "../../services/customerService";

const CustomerDropDown = ({ id, onSelect, name, error, defaultOptions, disabled }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [defaultCustomers, setDefaultCustomers] = useState([]);

    const loadOptions = async (inputValue, callback) => {
        if (inputValue) {
            const customerData = await Customer.crud.search(inputValue);
            const options = customerData.map((customer) => ({
                label: customer.name,
                value: customer.id,
            }));
            callback(options);
        } else {
            callback(defaultCustomers); // Use the default products when no input value is provided
        }
    };
    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxHeight: '200px',
            height: "40px",
            overflowY: 'auto',
            fontFamily: 'IRANSans',
            margin: 0,
            fontSize: '0.75rem',
            border: error ? "1px red solid" : "1px #ccc solid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
        }),
        option: (provided) => ({
            ...provided,
            fontSize: '0.75rem', // Set the font size for options
            color: "black"
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: "0.6rem", // Set the font size for options
            color: error ? "red" : "#686666"
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: "#626262"
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#626262"
        })
    };

    const handleCustomerChange = (selectedOption) => {
        setSelectedCustomer(selectedOption);
        onSelect(selectedOption ? selectedOption.value : null);
    };

    useEffect(() => {
        // Load default customer options when the component mounts
        const fetchDefaultCustomers = async () => {
            try {
                const customerData = await Customer.crud.getAllCustomers();
                const options = customerData.data.map((customer) => ({
                    label: customer.name,
                    value: customer.id,
                }));
                setDefaultCustomers(options);
            } catch (error) {
                console.error('Error loading default products:', error);
            }
        };

        // Use the provided defaultOptions if available, otherwise fetch default customers
        if (defaultOptions && defaultOptions.length > 0) {
            setDefaultCustomers(defaultOptions);
        } else {
            fetchDefaultCustomers();
        }
    }, [defaultOptions]);

    useEffect(() => {
        // Set the selected customer when the customerId prop changes
        if (id) {
            // Find the selected customer in the options
            const selectedOption = defaultCustomers.find((option) => option.value === id);
            setSelectedCustomer(selectedOption);
        } else {
            setSelectedCustomer(null);
        }
    }, [id, defaultCustomers]);

    return (
        <div style={{ fontFamily: "IRANSans" }}>
            <Select
                id={name}
                name={name}
                onChange={handleCustomerChange}
                isClearable={true}
                loadOptions={loadOptions}
                value={selectedCustomer}
                placeholder={error ? error : "انتخاب..."}
                defaultOptions={defaultCustomers} // Set the default options
                cacheOptions
                className={`${error ? "error text-danger" : ""}`}
                styles={customStyles}
                isDisabled={disabled}
            />
        </div>
    );
};

export default CustomerDropDown;
