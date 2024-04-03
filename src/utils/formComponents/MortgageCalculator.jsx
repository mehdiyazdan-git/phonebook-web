import React, { useState } from 'react';
import styled from 'styled-components';

// Persian translations
const translations = {
    principal: 'اصل وام',
    interest: 'نرخ سود',
    term: 'مدت',
    monthlyPayment: 'پرداخت ماهیانه',
    calculate: 'محاسبه',
};

// Styled components
const Wrapper = styled.div`
    padding: 24px;
    display: flex;
    justify-content: center;
    overflow: hidden;

    @media (min-width: 640px) {
        padding: 48px;
    }
`;

const CalculatorContainer = styled.div`
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    padding: 24px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    margin-bottom: 16px;
`;

const Button = styled.button`
    padding: 8px 16px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: white;
    color: #374151;
    cursor: pointer;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const MortgageCalculator = () => {
    const [principal, setPrincipal] = useState(0);
    const [interest, setInterest] = useState(0);
    const [term, setTerm] = useState(0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const calculate = () => {
        const p = principal;
        const i = interest / 100 / 12;
        const n = term * 12;
        const x = Math.pow(1 + i, n);
        const monthly = (p * x * i) / (x - 1);
        setMonthlyPayment(monthly.toFixed(2));
    };

    return (
        <Wrapper>
            <CalculatorContainer>
                <div>
                    <Label htmlFor="principal">{translations.principal}</Label>
                    <Input
                        type="number"
                        id="principal"
                        value={principal}
                        onChange={(e) => setPrincipal(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="interest">{translations.interest}</Label>
                    <Input
                        type="number"
                        id="interest"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="term">{translations.term}</Label>
                    <Input
                        type="number"
                        id="term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="monthlyPayment">{translations.monthlyPayment}</Label>
                    <Input
                        type="number"
                        id="monthlyPayment"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(e.target.value)}
                    />
                </div>
                <Button onClick={calculate}>{translations.calculate}</Button>
            </CalculatorContainer>
        </Wrapper>
    );
};

export default MortgageCalculator;
