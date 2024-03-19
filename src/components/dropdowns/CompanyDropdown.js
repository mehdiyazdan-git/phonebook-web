import { useEffect, useState } from "react";
import Company from "../../services/companyService";
import Select from 'react-select/async';
import { getCustomSelectStyles } from "./customStyles";

const CompanyDropdown = ({ id, onSelect, name, error, defaultOptions, disabled }) => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [defaultCompanies, setDefaultCompanies] = useState([]);
    const customStyles = getCustomSelectStyles(error);
    const loadOptions = async (inputValue, callback) => {
        if (inputValue) {
            const companyData = await Company.crud.search(inputValue);
            const options = companyData.map((company) => ({
                label: company.name,
                value: company.id,
            }));
            callback(options);
        } else {
            callback(defaultCompanies); // Use the default products when no input value is provided
        }
    };

    const handleCompanyChange = (selectedOption) => {
        setSelectedCompany(selectedOption);
        onSelect(selectedOption ? selectedOption.value : null);
    };

    useEffect(() => {
        // Load default product options when the component mounts
        const fetchDefaultCompanies = async () => {
            try {
                const companyData = await Company.crud.getAllCompanies();
                const options = companyData.data.map((company) => ({
                    label: company.name,
                    value: company.id,
                }));
                setDefaultCompanies(options);
            } catch (error) {
                console.error('Error loading default products:', error);
            }
        };

        // Use the provided defaultOptions if available, otherwise fetch default companies
        if (defaultOptions && defaultOptions.length > 0) {
            setDefaultCompanies(defaultOptions);
        } else {
            fetchDefaultCompanies();
        }
    }, [defaultOptions]);

    useEffect(() => {
        // Set the selected company when the companyId prop changes
        if (id) {
            // Find the selected company in the options
            const selectedOption = defaultCompanies.find((option) => option.value === id);
            setSelectedCompany(selectedOption);
        } else {
            setSelectedCompany(null);
        }
    }, [id, defaultCompanies]);

    return (
        <div style={{ fontFamily: "IRANSans" }}>
            <Select
                id={name}
                name={name}
                onChange={handleCompanyChange}
                isClearable={true}
                loadOptions={loadOptions}
                value={selectedCompany}
                placeholder={error ? error : "انتخاب..."}
                defaultOptions={defaultCompanies} // Set the default options
                cacheOptions
                className={` ${error ? "error text-danger" : ""}`}
                styles={customStyles}
                isDisabled={disabled}
            />
        </div>
    );
};

export default CompanyDropdown;
