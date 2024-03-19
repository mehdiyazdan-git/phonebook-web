import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import IconBxRefresh from '../assets/icons/IconBxRefresh';
import persianToArabicDigits from '../../utils/functions/persianToArabicDigits';
import getCurrentYear from "../../utils/functions/getCurrentYear";
import Company from "../../services/companyService"; // Changed from Sender to Company

const GenerateLetterNumberButton = () => {
    const [defaultCompanies, setDefaultCompanies] = useState([]);
    const { setValue, getValues } = useFormContext();

    useEffect(() => {
        const fetchDefaultCompanies = async () => {
            try {
                const companyData = await Company.crud.getCompanySelect().then(response => response.data);
                const options = companyData.map((company) => ({
                    name: company.name,
                    id: company.id,
                    letterPrefix: company?.letterPrefix,
                    letterCounter: company?.letterCounter,
                }));
                setDefaultCompanies(options);
            } catch (error) {
                console.error('Error loading default companies:', error);
            }
        };
        fetchDefaultCompanies();
    }, []);

    const generateLetterNumber = () => {
        const companyId = getValues('companyId');
        const company = defaultCompanies.find((company) => company.id === companyId) || {};
        const yearName = getCurrentYear();
        const letterNumberParts = [
            persianToArabicDigits(yearName.toString()),
            company.letterPrefix, // Changed from sender to company
            persianToArabicDigits((company.letterCounter + 1).toString()), // Changed from sender to company
        ].reverse(); // Reverse the parts for RTL context
        setValue('letterNumber', letterNumberParts.join('/'));
    };

    return (
        <button
            style={{ backgroundColor: 'transparent', border: 'none', padding: '0', margin: '0' }}
            type="button"
            onClick={generateLetterNumber}
        >
            <IconBxRefresh fontSize={30} />
        </button>
    );
};

export default GenerateLetterNumberButton;
