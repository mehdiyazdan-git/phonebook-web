import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import IconBxRefresh from '../assets/icons/IconBxRefresh';
import useHttp from "../../hooks/useHttp";

const GenerateLetterNumberButton = ({year}) => {
    const [defaultCompanies, setDefaultCompanies] = useState([]);
    const {
        setValue,
        getValues } = useFormContext();
    const http = useHttp();

     const getCompanySelect = async (queryParam) => {
        return await http.get(`/companies/select?queryParam=${queryParam ? queryParam : ''}`);
    };

    useEffect(() => {
        const fetchDefaultCompanies = async () => {
            try {
                const companyData = await getCompanySelect().then(response => response.data);
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
    const retrieveNewLetterNumber = async(companyId,yearId) => {
        return await http.get(`/letters/generate-number?companyId=${companyId}&yearId=${yearId}`);
    }

    const generateLetterNumber = async () => {
        try {
            const companyId = getValues('companyId');
            const response = await retrieveNewLetterNumber(companyId,year.value);
            if (response.status === 200){
                setValue('letterNumber', response.data.split('/').reverse().join('/'));
            }
        }catch (error){
            console.error('Error generating letter number:', error);
        }
    };

    useEffect(() => {
        async function fetchLetterNumber() {
            if (defaultCompanies.length > 0) {
                const selectedCompany = defaultCompanies.find(
                    (company) => company.id === getValues('companyId')
                );
                if (selectedCompany) {
                    const letterNumber = await retrieveNewLetterNumber(selectedCompany.id,year.value)
                        .then(response => response.data.split('/').reverse().join('/'));
                    setValue('letterNumber', letterNumber);
                }
            }
        }
        fetchLetterNumber();
    }, []);

    return (
       <>
           <button
               style={{ backgroundColor: 'transparent', border: 'none', padding: '0', margin: '0' }}
               type="button"
               onClick={generateLetterNumber}
           >
               <IconBxRefresh fontSize={30} />
           </button>
       </>
    );
};
export default GenerateLetterNumberButton;
