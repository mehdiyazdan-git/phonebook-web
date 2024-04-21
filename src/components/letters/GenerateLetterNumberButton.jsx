import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import IconBxRefresh from '../assets/icons/IconBxRefresh';
import persianToArabicDigits from '../../utils/functions/persianToArabicDigits';
import getCurrentYear from "../../utils/functions/getCurrentYear";
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

    const generateLetterNumber = () => {

        const companyId = getValues('companyId');
        const company = defaultCompanies.find((company) => company.id === companyId) || {};
        const letterNumberParts = [
            persianToArabicDigits(year.label.toString()),
            company.letterPrefix,
            persianToArabicDigits((company.letterCounter + 1 + year.startingLetterNumber).toString()),
        ].reverse();
        setValue('letterNumber', letterNumberParts.join('/'));
        console.log(year)
    };

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
